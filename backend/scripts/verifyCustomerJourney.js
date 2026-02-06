const mongoose = require('mongoose');
const dashboardController = require('../controllers/customer/customerDashboardController');
const menuController = require('../controllers/customer/menuController');
const walletController = require('../controllers/customer/walletController');
const discoveryController = require('../controllers/customer/messDiscoveryController');
const User = require('../models/user.model');
const fs = require('fs');
require('dotenv').config({ path: '.env' });
const LOG_FILE = 'customer_journey_report.txt';

function log(msg) {
    fs.appendFileSync(LOG_FILE, msg + '\n');
    console.log(msg);
}

// Mock Response Object
const mockRes = () => {
    const res = {};
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };
    res.json = (data) => {
        res.data = data;
        return res;
    };
    return res;
};

async function verifyJourney() {
    try {
        fs.writeFileSync(LOG_FILE, "=== CUSTOMER JOURNEY VERIFICATION REPORT ===\n\n");

        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Smart-Tiffin-System');
        log("✅ Connected to DB");

        // 1. Authenticate User
        const user = await User.findOne({ email: 'customer@gmail.com' });
        if (!user) throw new Error("User customer@gmail.com not found!");
        log(`🔹 User Found: ${user.fullName} (${user._id})`);

        const req = { user: user, query: {} };

        // 2. DASHBOARD
        log("\n--- [1] DASHBOARD CHECK ---");
        const dashRes = mockRes();
        await dashboardController.getCustomerDashboard(req, dashRes);
        if (dashRes.statusCode && dashRes.statusCode !== 200) {
            log(`❌ Dashboard Error: Status ${dashRes.statusCode}`);
        } else if (dashRes.data && dashRes.data.success) {
            log(`✅ Dashboard Loaded`);
            log(`   - Subscription: ${dashRes.data.data.subscription ? "Active" : "Inactive"}`);
            log(`   - Wallet Balance: ₹${dashRes.data.data.walletBalance}`);
            if (dashRes.data.data.subscription) {
                log(`   - Plan: ${dashRes.data.data.subscription.planName}`);
            }
        } else {
            log(`❌ Dashboard Failed: Invalid Response`);
        }

        // 3. MENU (Today)
        log("\n--- [2] TODAY'S MENU CHECK ---");
        const menuRes = mockRes();
        await menuController.getTodayMenu(req, menuRes);
        if (menuRes.data && menuRes.data.success) {
            const lunch = menuRes.data.data.lunch;
            const dinner = menuRes.data.data.dinner;
            log(`✅ Menu Fetched`);
            log(`   - Lunch: ${lunch ? lunch.name : "Not Available"}`);
            log(`   - Dinner: ${dinner ? dinner.name : "Not Available"}`);
        } else {
            log(`⚠️ Menu Fetch Warning: ${menuRes.data ? menuRes.data.message : "Unknown Error"}`);
        }

        // 4. WALLET
        log("\n--- [3] WALLET CHECK ---");
        const walletRes = mockRes();
        await walletController.getWalletDetails(req, walletRes);
        if (walletRes.data && walletRes.data.success) {
            log(`✅ Wallet Details Fetched`);
            log(`   - Balance: ₹${walletRes.data.data.balance}`);
            log(`   - Transactions: ${walletRes.data.data.transactions?.length || 0}`);
        } else {
            log(`❌ Wallet Error`);
        }

        // 5. DISCOVERY
        log("\n--- [4] DISCOVERY CHECK (Indore) ---");
        req.query = { location: 'Indore' };
        const discRes = mockRes();
        await discoveryController.findMessProviders(req, discRes);
        if (discRes.data && discRes.data.success) {
            log(`✅ Discovery Search 'Indore'`);
            log(`   - Providers Found: ${discRes.data.data.length}`);
            discRes.data.data.forEach(p => log(`     * ${p.name} - ${p.priceRange}`));
        } else {
            log(`❌ Discovery Error`);
        }

    } catch (err) {
        log(`\n❌ CRITICAL ERROR: ${err.message}`);
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

verifyJourney();
