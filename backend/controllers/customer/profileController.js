const User = require("../../models/user.model");
const Subscription = require("../../models/subscription.model");
const Transaction = require("../../models/transaction.model");
const Order = require("../../models/order.model");
const PDFDocument = require("pdfkit");
const logger = require("../../utils/logger");
const bcrypt = require("bcryptjs");

const Customer = require("../../models/customer.model");
const { verifyPin } = require("./walletController");

// Get customer profile data
exports.getProfile = async (req, res) => {
    try {
        const customerId = req.user._id;

        // Get user details
        const user = await User.findById(customerId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get Customer details
        let customer = await Customer.findOne({ user: customerId });

        // AUTO-MIGRATION: If customer profile doesn't exist (old user), create it from User data
        if (!customer && user.role === 'customer') {
            customer = await Customer.create({
                user: user._id,
                dietPreference: user.dietPreference || 'Pure Veg',
                addresses: user.address ? [{ label: 'Home', line: user.address, isDefault: true }] : [],
                activeSubscription: user.activeSubscription
            });
        }

        // Calculate total spent
        const totalSpentResult = await Transaction.aggregate([
            { $match: { customer: customerId, type: 'debit' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalSpent = totalSpentResult[0]?.total || 0;

        // Calculate loyalty level based on total subscriptions: USING CUSTOMER MODEL NOW?
        // Subscription model links to `customer` (User ID). So this stays same.
        const totalSubscriptions = await Subscription.countDocuments({
            customer: customerId,
            status: 'approved'
        });

        let loyaltyLevel = 'Bronze';
        if (totalSubscriptions >= 5) loyaltyLevel = 'Gold';
        else if (totalSubscriptions >= 2) loyaltyLevel = 'Silver';

        // Member since date
        const memberSince = user.createdAt.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        });

        // Profile stats
        const stats = [
            { label: 'Member Since', value: memberSince, icon: 'calendar_month' },
            { label: 'Total Spent', value: `₹${totalSpent.toLocaleString()}`, icon: 'payments', color: 'text-primary' },
            { label: 'Loyalty Level', value: loyaltyLevel, icon: 'military_tech', color: 'text-orange-500' }
        ];

        // Format user data for frontend
        const profileData = {
            id: user._id,
            name: user.fullName,
            email: user.email,
            phone: user.mobile,
            // Address: Return default address for backward compatibility or first address
            address: customer?.addresses?.find(a => a.isDefault)?.line || customer?.addresses?.[0]?.line || '',
            diet: customer?.dietPreference || 'Pure Veg',
            spiceLevel: customer?.foodPreferences?.spiceLevel || 'Medium',
            sweetTooth: customer?.foodPreferences?.sweetTooth || false,
            memberSince,
            profileImage: user.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`,
            studentId: `#ST-${user._id.toString().slice(-6).toUpperCase()}`,
            status: user.status === 'active' ? 'Active' : 'Inactive',
            isVerified: user.isVerified
        };

        res.json({
            success: true,
            data: {
                profile: profileData,
                stats
            }
        });

    } catch (error) {
        logger.error("getProfile Error:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile data'
        });
    }
};

// Update customer profile
exports.updateProfile = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { name, phone, email, address, diet } = req.body;

        // Validate required fields
        if (!name || !phone || !email) {
            return res.status(400).json({
                success: false,
                message: 'Name, phone, and email are required'
            });
        }

        // Check if email is already taken by another user
        if (email !== req.user.email) {
            const existingUser = await User.findOne({
                email,
                _id: { $ne: customerId }
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }
        }

        // Update User (Common Data)
        const updatedUser = await User.findByIdAndUpdate(
            customerId,
            {
                fullName: name,
                mobile: phone,
                email,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update Customer (Specific Data)
        // Extract label from address string if present [Home] ...
        let addressLine = address;
        let addressLabel = 'Home';
        const labelMatch = address.match(/^\[(.*?)\]\s*(.*)/);
        if (labelMatch) {
            addressLabel = labelMatch[1];
            addressLine = labelMatch[2];
        }

        // Extract food preferences from request or use defaults
        const { spiceLevel, sweetTooth, allergies } = req.body;

        const updatedCustomer = await Customer.findOneAndUpdate(
            { user: customerId },
            {
                dietPreference: diet || 'Pure Veg',
                // For now, replacing the addresses array with single entry to match frontend behavior 
                // until we have full address management UI
                addresses: [{
                    label: addressLabel,
                    line: addressLine,
                    isDefault: true
                }],
                foodPreferences: {
                    spiceLevel: spiceLevel || 'Medium',
                    sweetTooth: sweetTooth || false,
                    allergies: allergies || []
                }
            },
            { new: true, upsert: true } // Create if not exists
        );

        res.json({
            success: true,
            data: {
                profile: {
                    id: updatedUser._id,
                    name: updatedUser.fullName,
                    email: updatedUser.email,
                    phone: updatedUser.mobile,
                    address: updatedCustomer.addresses[0]?.line ? `[${updatedCustomer.addresses[0].label}] ${updatedCustomer.addresses[0].line}` : '',
                    diet: updatedCustomer.dietPreference,
                    // Return new fields
                    spiceLevel: updatedCustomer.foodPreferences?.spiceLevel,
                    sweetTooth: updatedCustomer.foodPreferences?.sweetTooth,
                },
                message: 'Profile updated successfully'
            }
        });

    } catch (error) {
        logger.error("updateProfile Error:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
};

// Upload profile image
exports.uploadProfileImage = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Image URL is required'
            });
        }

        // Update profile image
        const updatedUser = await User.findByIdAndUpdate(
            customerId,
            {
                profile_image: imageUrl,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {
                profileImage: updatedUser.profile_image,
                message: 'Profile image updated successfully'
            }
        });

    } catch (error) {
        logger.error("uploadProfileImage Error:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload profile image'
        });
    }
};

// Get profile summary for dashboard
exports.getProfileSummary = async (req, res) => {
    try {
        const customerId = req.user._id;

        const user = await User.findById(customerId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get active subscription
        const activeSubscription = await Subscription.findOne({
            customer: customerId,
            status: 'approved',
            endDate: { $gte: new Date() }
        });

        // Get recent orders count
        const recentOrdersCount = await Order.countDocuments({
            customer: customerId,
            orderDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
        });

        const summary = {
            name: user.fullName,
            email: user.email,
            profileImage: user.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`,
            hasActiveSubscription: !!activeSubscription,
            recentOrdersCount,
            memberSince: user.createdAt.toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
            })
        };

        res.json({
            success: true,
            data: summary
        });

    } catch (error) {
        logger.error("getProfileSummary Error:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile summary'
        });
    }
};

// Export all user data as PDF
exports.exportUserData = async (req, res) => {
    try {
        const customerId = req.user._id;

        const user = await User.findById(customerId);
        const customer = await Customer.findOne({ user: customerId });
        const subscriptions = await Subscription.find({ customer: customerId });
        const transactions = await Transaction.find({ customer: customerId }).sort({ createdAt: -1 });

        const doc = new PDFDocument({ margin: 40 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=my-data-${Date.now()}.pdf`);
        doc.pipe(res);

        // Header
        doc.rect(0, 0, 612, 100).fill('#2D241E');
        doc.fillColor('#FFFFFF').fontSize(20).font('Helvetica-Bold').text('MY DATA REPORT', 40, 40);
        doc.fontSize(10).font('Helvetica').text('Smart Tiffin System - Personal Information Record', 40, 65);

        // Profile Section
        doc.fillColor('#2D241E').fontSize(14).font('Helvetica-Bold').text('Profile Details', 40, 130);
        doc.fontSize(10).font('Helvetica').fillColor('#555555');
        doc.text(`Full Name: ${user.fullName}`, 40, 155);
        doc.text(`Email: ${user.email}`, 40, 170);
        doc.text(`Mobile: ${user.mobile}`, 40, 185);
        doc.text(`Member Since: ${user.createdAt.toLocaleDateString()}`, 40, 200);

        // Subscription History
        doc.fillColor('#2D241E').fontSize(14).font('Helvetica-Bold').text('Subscription History', 40, 240);
        let y = 265;
        subscriptions.forEach((sub, i) => {
            if (y > 700) { doc.addPage(); y = 50; }
            doc.fontSize(9).font('Helvetica').fillColor('#555555')
                .text(`${i + 1}. Plan ID: ${sub.planId} | Status: ${sub.status} | Period: ${sub.startDate.toLocaleDateString()} to ${sub.endDate.toLocaleDateString()}`, 40, y);
            y += 15;
        });

        // Wallet Activity (Last 10)
        doc.fillColor('#2D241E').fontSize(14).font('Helvetica-Bold').text('Recent Wallet Activity', 40, y + 20);
        y += 45;
        transactions.slice(0, 10).forEach((tx, i) => {
            if (y > 700) { doc.addPage(); y = 50; }
            doc.fontSize(9).font('Helvetica').fillColor('#555555')
                .text(`${new Date(tx.createdAt).toLocaleDateString()} | ${tx.type.toUpperCase()} | ₹${tx.amount} | ${tx.description}`, 40, y);
            y += 15;
        });

        doc.fillColor('#999999').fontSize(8).text('This report contains all personal information stored in our system as per your request.', 40, 750, { align: 'center', width: 512 });

        doc.end();

    } catch (error) {
        logger.error("exportUserData Error:", error);
        res.status(500).json({ success: false, message: 'Failed to export data' });
    }
};

// Delete account with PIN verification and scrubbing
exports.deleteAccount = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { reason, pin } = req.body;

        if (!pin) {
            return res.status(400).json({ success: false, message: 'Transaction PIN is required' });
        }

        // 1. Verify PIN
        const pinCheck = await verifyPin(customerId, pin);
        if (!pinCheck.success) {
            return res.status(401).json({ success: false, message: pinCheck.message });
        }

        // 2. Check for active subscriptions
        const activeSubscription = await Subscription.findOne({
            customer: customerId,
            status: 'approved',
            endDate: { $gte: new Date() }
        });

        if (activeSubscription) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete account with active subscription. Please cancel subscription first.'
            });
        }

        // 3. Scrub and soft-delete
        // We "Scrub" PII (Personal Identifiable Information) but keep record for finance/audit
        const scrubbedName = "Deleted User " + customerId.toString().slice(-4);
        const scrubbedEmail = `deleted_${customerId}@smarttiffin.com`;
        const scrubbedMobile = "0000000000";

        await User.findByIdAndUpdate(customerId, {
            fullName: scrubbedName,
            email: scrubbedEmail,
            mobile: scrubbedMobile,
            status: 'inactive',
            deletedAt: new Date(),
            deletionReason: reason || 'User requested'
        });

        // Also scrub customer profile addresses
        await Customer.findOneAndUpdate({ user: customerId }, {
            addresses: [],
            profileImage: ""
        });

        res.json({
            success: true,
            data: {
                message: 'Account deleted and data anonymized successfully'
            }
        });

    } catch (error) {
        logger.error("deleteAccount Error:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete account'
        });
    }
};

// Update security settings
exports.updateSecuritySettings = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { enhancedEncryption, loginAlerts } = req.body;

        const customer = await Customer.findOneAndUpdate(
            { user: customerId },
            {
                $set: {
                    'securitySettings.enhancedEncryption': enhancedEncryption,
                    'securitySettings.loginAlerts': loginAlerts
                }
            },
            { new: true, upsert: true }
        );

        res.json({
            success: true,
            data: customer.securitySettings,
            message: 'Security settings updated successfully'
        });

    } catch (error) {
        logger.error("updateSecuritySettings Error:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to update security settings'
        });
    }
};