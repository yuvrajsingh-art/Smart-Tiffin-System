/**
 * =============================================================================
 * PROVIDER CONTROLLER
 * =============================================================================
 * Handles provider management operations
 * =============================================================================
 */

const User = require("../../models/user.model");
const Provider = require("../../models/providerprofile.model");
const StoreProfile = require("../../models/storeProfile.model");
const bcrypt = require("bcryptjs");

const { sendSuccess, sendError } = require("../../utils/responseHelper");
const { isValidObjectId, isValidEmail, isValidMobile, validateRequired } = require("../../utils/validationHelper");
const { createLog } = require("./helpers");

/**
 * Add new provider with complete profile
 * @route POST /api/admin/providers
 */
exports.addProvider = async (req, res) => {
    try {
        const {
            // User Fields
            fullName, email, password, mobile, userAddress,
            // Provider Profile Fields
            messName, ownerName, phone, fssaiNumber, commission_rate,
            bankDetails, // { accountHolderName, accountNumber, ifscCode }
            location,    // { address, city, pincode, coordinates: [lng, lat] }
            // Store Profile Fields
            cuisines, lunch_start, lunch_end, dinner_start, dinner_end,
            monthlyPrice, weeklyPrice, delivery_radius_km, store_address
        } = req.body;

        // 1. Basic Validation
        const requiredFields = ['fullName', 'email', 'password', 'mobile', 'messName'];
        const validation = validateRequired(req.body, requiredFields);
        if (!validation.valid) {
            return sendError(res, 400, `Missing required fields: ${validation.missing.join(', ')}`);
        }

        if (!isValidEmail(email)) return sendError(res, 400, "Invalid email format");
        if (!isValidMobile(mobile)) return sendError(res, 400, "Invalid mobile number format");

        // 2. Check Existence
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) return sendError(res, 400, "User with this email already exists");

        // 3. Create User Account
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            fullName,
            email: email.toLowerCase(),
            password: hashedPassword,
            mobile,
            address: userAddress || location?.address || "",
            role: 'provider',
            isVerified: true,
            status: 'active'
        });

        // 4. Create Provider Profile
        const newProviderProfile = await Provider.create({
            user: newUser._id,
            messName,
            ownerName: ownerName || fullName,
            phone: phone || mobile,
            fssaiNumber,
            commission_rate: commission_rate || 15,
            bankDetails: bankDetails || {},
            location: {
                type: "Point",
                coordinates: location?.coordinates || [0, 0],
                address: location?.address || userAddress || "",
                city: location?.city || "",
                pincode: location?.pincode || ""
            },
            isOnboardingComplete: true,
            onboardingStep: 4,
            isActive: true
        });

        // 5. Create Store Profile
        await StoreProfile.create({
            provider: newUser._id,
            mess_name: messName,
            contact_number: phone || mobile,
            cuisines: cuisines || ["Thali"],
            lunch_start: lunch_start || "11:00 AM",
            lunch_end: lunch_end || "03:00 PM",
            dinner_start: dinner_start || "07:00 PM",
            dinner_end: dinner_end || "11:00 PM",
            monthlyPrice: monthlyPrice || 3500,
            weeklyPrice: weeklyPrice || 900,
            delivery_radius_km: delivery_radius_km || 5,
            address: {
                street: store_address?.street || location?.address || "",
                city: store_address?.city || location?.city || "",
                state: store_address?.state || "",
                pincode: store_address?.pincode || location?.pincode || "",
                landmark: store_address?.landmark || ""
            },
            is_active: true
        });

        // 6. Log Action
        await createLog(
            'PROVIDER_REGISTERED',
            `Admin registered new provider: ${messName} (${fullName})`,
            req.user.id,
            'add_business',
            'text-indigo-600'
        );

        return sendSuccess(res, 201, "Provider registered successfully with full profiles", {
            userId: newUser._id,
            email: newUser.email,
            messName: messName
        });

    } catch (error) {
        console.error("Admin Add Provider Error:", error);
        return sendError(res, 500, "Failed to register provider", error.message);
    }
};

/**
 * Get all providers with filters
 * @route GET /api/admin/providers
 * @query {String} status - Filter: 'Active' or 'Pending'
 * @query {String} search - Search by name or email
 */
exports.getProviders = async (req, res) => {
    try {
        const { status, search } = req.query;
        let query = { role: 'provider' };

        // Status filter
        if (status && status !== 'All') {
            if (status === 'Active') query.isVerified = true;
            else if (status === 'Pending') query.isVerified = false;
        }

        // Search filter
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const providers = await User.find(query).sort({ createdAt: -1 });
        const providerIds = providers.map(p => p._id);
        const profiles = await Provider.find({ owner: { $in: providerIds } });

        // Merge profile data
        const mergedData = providers.map(provider => {
            const profile = profiles.find(p => p.owner.toString() === provider._id.toString());
            return {
                ...provider.toObject(),
                profile: profile || null
            };
        });

        return sendSuccess(res, 200, "Providers retrieved successfully", mergedData);
    } catch (error) {
        console.error("Get Providers Error:", error.message);
        return sendError(res, 500, "Failed to fetch providers", error);
    }
};

/**
 * Verify/Approve provider
 * @route PUT /api/admin/providers/:id/verify
 * @param {String} id - Provider ID
 */
exports.verifyProvider = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return sendError(res, 400, "Invalid provider ID");
        }

        const provider = await User.findByIdAndUpdate(
            id,
            { isVerified: true },
            { new: true }
        );

        if (!provider) {
            return sendError(res, 404, "Provider not found");
        }

        // Log action
        await createLog(
            'PROVIDER_VERIFIED',
            `Provider ${provider.fullName} was approved.`,
            req.user.id,
            'verified',
            'text-emerald-500'
        );

        return sendSuccess(res, 200, "Provider verified successfully", provider);
    } catch (error) {
        console.error("Verify Provider Error:", error.message);
        return sendError(res, 500, "Failed to verify provider", error);
    }
};

/**
 * Toggle provider status (suspend/activate)
 * @route PUT /api/admin/providers/:id/status
 * @param {String} id - Provider ID
 */
exports.toggleProviderStatus = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return sendError(res, 400, "Invalid provider ID");
        }

        const provider = await User.findById(id);
        if (!provider) {
            return sendError(res, 404, "Provider not found");
        }

        // Toggle status
        provider.status = provider.status === 'active' ? 'suspended' : 'active';
        await provider.save();

        // Log action
        await createLog(
            'PROVIDER_STATUS_TOGGLE',
            `Provider ${provider.fullName} status set to ${provider.status}.`,
            req.user.id,
            provider.status === 'active' ? 'check_circle' : 'block',
            provider.status === 'active' ? 'text-emerald-500' : 'text-rose-500'
        );

        return sendSuccess(res, 200, `Provider ${provider.status === 'active' ? 'activated' : 'suspended'}`, provider);
    } catch (error) {
        console.error("Toggle Provider Error:", error.message);
        return sendError(res, 500, "Failed to toggle provider status", error);
    }
};

/**
 * Update provider details
 * @route PUT /api/admin/providers/:id
 * @param {String} id - Provider ID
 * @body {Object} updateData - Provider update data
 */
exports.updateProvider = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!isValidObjectId(id)) {
            return sendError(res, 400, "Invalid provider ID");
        }

        const provider = await User.findByIdAndUpdate(id, updateData, { new: true });

        if (!provider) {
            return sendError(res, 404, "Provider not found");
        }

        return sendSuccess(res, 200, "Provider updated successfully", provider);
    } catch (error) {
        console.error("Update Provider Error:", error.message);
        return sendError(res, 500, "Failed to update provider", error);
    }
};

/**
 * Delete provider
 * @route DELETE /api/admin/providers/:id
 * @param {String} id - Provider ID
 */
exports.deleteProvider = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return sendError(res, 400, "Invalid provider ID");
        }

        const provider = await User.findByIdAndDelete(id);
        if (!provider) {
            return sendError(res, 404, "Provider not found");
        }

        // Delete provider profile
        await Provider.findOneAndDelete({ owner: id });

        return sendSuccess(res, 200, "Provider deleted successfully");
    } catch (error) {
        console.error("Delete Provider Error:", error.message);
        return sendError(res, 500, "Failed to delete provider", error);
    }
};
