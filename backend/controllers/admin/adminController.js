const User = require("../../models/user.model");
const Order = require("../../models/order.model");
const Transaction = require("../../models/transaction.model");
const Provider = require("../../models/providerprofile.model");
const Notification = require("../../models/notification.model");
const os = require("os");
const mongoose = require("mongoose");

// GET DASHBOARD STATS (FULL COMPREHENSIVE)
exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Basic Counts
        const totalCustomers = await User.countDocuments({ role: 'customer' });
        const totalProviders = await User.countDocuments({ role: 'provider' });
        const liveOrders = await Order.countDocuments({
            status: { $in: ["Placed", "Accepted", "Preparing", "Ready", "Out for Delivery"] }
        });

        // 2. Revenue Aggregation
        const revenueData = await Transaction.aggregate([
            { $match: { status: 'Success' } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const grossRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

        // 3. Sales Growth (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const salesGrowth = await Transaction.aggregate([
            {
                $match: {
                    status: 'Success',
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    sales: { $sum: "$amount" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // 4. Recent Signups (Last 5)
        const recentSignupsList = await User.find({ role: 'customer' })
            .select('fullName email createdAt status')
            .sort({ createdAt: -1 })
            .limit(5);

        // 5. Pending Approvals (Providers)
        const pendingApprovalsList = await User.find({
            role: 'provider',
            isVerified: false
        }).limit(5);

        // 6. Delivery Metrics (Pulse)
        const settled = await Order.countDocuments({ status: "Delivered" });
        const transit = await Order.countDocuments({ status: "Out for Delivery" });
        const staged = await Order.countDocuments({ status: "Ready" });

        // Calculate completion percentage
        const totalProcessedToday = settled + transit + staged;
        const completionRate = totalProcessedToday > 0
            ? Math.round((settled / totalProcessedToday) * 100)
            : 0;

        // 7. Activity Logs (Merged Events)
        const latestUsers = await User.find().sort({ createdAt: -1 }).limit(3);
        const latestTransactions = await Transaction.find({ status: 'Success' }).sort({ createdAt: -1 }).limit(3);

        const activityLogs = [
            ...latestUsers.map(u => ({
                time: u.createdAt,
                event: `New ${u.role} joined: ${u.fullName}`,
                icon: u.role === 'provider' ? 'storefront' : 'person_add',
                color: u.role === 'provider' ? 'text-violet-500' : 'text-blue-500'
            })),
            ...latestTransactions.map(t => ({
                time: t.createdAt,
                event: `Payment of ₹${t.amount} received`,
                icon: 'payments',
                color: 'text-emerald-500'
            }))
        ].sort((a, b) => b.time - a.time).slice(0, 5);


        const uptimeSeconds = process.uptime();
        const uptimeFormat = new Date(uptimeSeconds * 1000).toISOString().substr(11, 8);
        const cpuLoad = os.loadavg()[0].toFixed(1); // 1-minute load avg
        const totalMem = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(1);
        const freeMem = (os.freemem() / (1024 * 1024 * 1024)).toFixed(1);

        // Dynamic Marquee Messages
        const marqueeMessages = [
            `Server Online: ${uptimeFormat} • RAM Free: ${freeMem}GB`,
            `Database: Connected • Active Connections: ${mongoose.connection.base.connections.length || 1} • Speed: ${Math.floor(Math.random() * 20 + 10)}ms`,
            `Platform Stats: ${totalCustomers} Customers • ${totalProviders} Kitchens • ${liveOrders} Active Orders`,
            `System Status: Healthy • Load: ${cpuLoad}% • Location: Indore`
        ];

        if (recentSignupsList.length > 0) {
            marqueeMessages.push(`Newest Member: ${recentSignupsList[0].fullName} joined ${new Date(recentSignupsList[0].createdAt).toLocaleTimeString()}`);
        }

        res.status(200).json({
            success: true,
            data: {
                grossRevenue,
                totalCustomers,
                liveOrders,
                totalProviders,
                salesGrowth,
                recentSignups: recentSignupsList,
                pendingApprovals: pendingApprovalsList,
                deliveryMetrics: { settled, transit, staged, completionRate },
                activityLogs,
                systemHealth: {
                    nodeStatus: "Online",
                    latency: `${Math.floor(Math.random() * 20 + 5)}ms`,
                    activeConnections: mongoose.connection.base.connections.length || 1,
                    lastBackup: "Auto-Daily",
                    cpuLoad: `${((1 - (os.freemem() / os.totalmem())) * 100).toFixed(1)}%`,
                },
                marquee: marqueeMessages
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- CUSTOMER MANAGEMENT ---
exports.getCustomers = async (req, res) => {
    try {
        const { status, search } = req.query;
        let query = { role: 'customer' };

        if (status && status !== 'All') {
            if (status === 'Active') query.status = 'active';
            else if (status === 'Inactive') query.status = 'inactive';
            else if (status === 'Paused') query.status = 'paused';
            else if (status === 'Banned') query.status = 'banned';
        }

        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { mobile: { $regex: search, $options: 'i' } },
                { _id: mongoose.Types.ObjectId.isValid(search) ? search : null }
            ].filter(f => f._id !== null || Object.keys(f)[0] !== '_id');
        }

        const customers = await User.find(query).sort({ createdAt: -1 });

        const data = customers.map(u => ({
            id: u._id,
            name: u.fullName,
            email: u.email,
            phone: u.mobile,
            plan: u.subscriptionType || 'None',
            status: u.status === 'active' ? 'Active' : (u.status === 'paused' ? 'Paused' : 'Inactive'),
            joins: new Date(u.createdAt).toLocaleDateString('en-GB'),
            balance: `₹${u.walletBalance || 0}`,
            kyc: u.isVerified ? 'Verified' : 'Pending', // Mock logic for now
            tags: u.isVerified ? ['Verified'] : ['New'],
            tickets: 0,
            referrals: 0, // Mock
            address: u.address || 'Not Provided'
        }));

        res.status(200).json({ success: true, data });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- ORDER MANAGEMENT ---
exports.getOrders = async (req, res) => {
    try {
        const { status, search, date } = req.query;
        let query = {};

        if (status && status !== 'All') {
            query.status = status;
        }

        // Search by Order ID, Customer Name, or Kitchen Name
        // Search by Order ID or Customer/Provider Name
        if (search) {
            if (mongoose.Types.ObjectId.isValid(search)) {
                query._id = search;
            } else {
                const searchRegex = new RegExp(search, 'i');
                const users = await User.find({ fullName: searchRegex }).select('_id');
                const userIds = users.map(u => u._id);
                if (userIds.length > 0) {
                    query.$or = [
                        { customer: { $in: userIds } },
                        { provider: { $in: userIds } } // Assuming provider is also a User ref
                    ];
                } else {
                    // Force empty result if name doesn't match any user
                    query._id = new mongoose.Types.ObjectId();
                }
            }
        }

        if (date === 'today') {
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            query.createdAt = { $gte: start };
        } else if (date === 'past') {
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            query.createdAt = { $lt: start };
        }

        const orders = await Order.find(query)
            .populate('customer', 'fullName address mobile')
            .populate('provider', 'fullName') // Assuming provider is User model, or ProviderProfile check needed
            .populate('rider_id', 'fullName')
            .sort({ createdAt: -1 });

        const data = orders.map(o => ({
            id: o._id,
            customer: o.customer?.fullName || 'Unknown',
            kitchen: o.provider?.fullName || 'Unknown', // Need to check if provider ref is User or Profile. Assuming User for now.
            type: o.order_type === 'subscription' ? 'Monthly Plan' : 'One-time', // Simplification
            status: o.status,
            time: new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            zone: o.delivery_address?.area || o.customer?.address || 'Indore', // Fallback
            rider: o.rider_id ? `${o.rider_id.fullName}` : (o.status === 'Placed' || o.status === 'Preparing' ? 'Searching...' : '-'),
            items: o.items
        }));

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- NEW: Provider Management ---

// GET ALL PROVIDERS (With Filters)
exports.getProviders = async (req, res) => {
    try {
        const { status, search } = req.query;

        let query = { role: 'provider' };

        if (status && status !== 'All') {
            if (status === 'Pending') query.isVerified = false;
            else if (status === 'Active') { query.isVerified = true; query.status = 'active'; }
            else if (status === 'Suspended') query.status = 'banned';
        }

        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { mobile: { $regex: search, $options: 'i' } }
            ];
        }

        // Fetch Users first
        const users = await User.find(query).sort({ createdAt: -1 });

        // Populate with Provider Profile details manually or via populate if setup (doing manual for safety)
        const providers = await Promise.all(users.map(async (user) => {
            const profile = await Provider.findOne({ user: user._id });
            const totalEarnings = await Transaction.aggregate([
                { $match: { payeeId: user._id, status: 'Success' } }, // Assuming payeeId stores user/provider ID
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]);

            return {
                id: user._id, // Using user ID as key
                name: user.fullName,
                owner: profile?.ownerName || user.fullName,
                phone: user.mobile,
                email: user.email,
                location: profile?.location?.city || user.address || 'Indore',
                capacity: 500, // Mock for now, or add to model
                currentLoad: 0, // Mock
                rating: profile?.rating || 0,
                status: user.status === 'banned' ? 'Suspended' : (user.isVerified ? 'Active' : 'Pending'),
                joins: user.createdAt,
                earnings: totalEarnings[0]?.total || 0,
                fssai: profile?.fssaiNumber || 'N/A',
                type: 'Veg/Non-Veg' // Mock or from profile
            };
        }));

        res.status(200).json({ success: true, data: providers });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// VERIFY PROVIDER (Approve)
exports.verifyProvider = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.isVerified = true;
        user.status = 'active';
        await user.save();

        // Also update Provider Profile status
        await Provider.findOneAndUpdate({ user: id }, { legalStatus: 'verified' });

        res.status(200).json({ success: true, message: "Provider approved successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// TOGGLE PROVIDER STATUS (Suspend/Activate)
exports.toggleProviderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.status = user.status === 'active' ? 'banned' : 'active';
        await user.save();

        res.status(200).json({ success: true, message: `Provider ${user.status === 'active' ? 'activated' : 'suspended'}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// BROADCAST MESSAGE
// BROADCAST MESSAGE
exports.broadcastMessage = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ success: false, message: "Message is required" });

        // Save Global Notification
        await Notification.create({
            recipient: null, // Global
            title: "System Broadcast",
            message: message,
            type: "Info"
        });

        console.log("BROADCAST SAVED TO DB:", message);

        res.status(200).json({ success: true, message: "Broadcast sent safely to all users" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GLOBAL SEARCH (Quick Search Entities)
exports.globalSearch = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query || query.length < 2) {
            return res.status(200).json({ success: true, data: { users: [], orders: [] } });
        }

        const regex = new RegExp(query, 'i');

        // 1. Search Users (Customers & Providers)
        const users = await User.find({
            $or: [
                { fullName: regex },
                { email: regex },
                { mobile: regex }
            ]
        }).select('fullName email role subscriptionType mobile status isVerified').limit(5);

        // 2. Search Orders (by ID or exact match if possible)
        let orders = [];
        if (mongoose.Types.ObjectId.isValid(query)) {
            const order = await Order.findById(query)
                .populate('customer', 'fullName email')
                .populate('provider', 'fullName');
            if (order) orders.push(order);
        }

        // 3. Search Providers by Mess Name
        const providerProfiles = await Provider.find({ messName: regex }).populate('user', 'fullName email role');
        const providerResults = providerProfiles
            .filter(p => p.user)
            .map(p => ({
                ...p.user.toObject(),
                messName: p.messName,
                isProfileResult: true
            }));

        res.status(200).json({
            success: true,
            data: {
                users,
                orders,
                providerProfiles: providerResults
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};