const mongoose = require('mongoose');
const dashboardController = require('../controllers/provider/providerDeshbordcontroller');
const menuController = require('../controllers/provider/providerMenucontroller');
const User = require('../models/user.model');
const fs = require('fs');
require('dotenv').config({ path: '../.env' });

const LOG_FILE = 'provider_journey_report.txt';

function log(msg) {
    fs.appendFileSync(LOG_FILE, msg + '\n');
    console.log(msg);
}

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

async function verifyProvider() {
    try {
        fs.writeFileSync(LOG_FILE, "=== PROVIDER JOURNEY VERIFICATION REPORT ===\n\n");
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Smart-Tiffin-System');

        // 1. Find a Provider
        const provider = await User.findOne({ role: 'provider' });
        if (!provider) throw new Error("No Provider found!");
        log(`🔹 Provider Found: ${provider.fullName} (${provider._id})`);

        const req = { user: provider, query: {} };

        // 2. DASHBOARD STATS
        log("\n--- [1] DASHBOARD STATS ---");
        const statsRes = mockRes();
        await dashboardController.getProviderDashboard(req, statsRes);
        if (statsRes.statusCode && statsRes.statusCode !== 200) {
            log(`❌ Stats Error: ${statsRes.statusCode}`);
        } else if (statsRes.data && statsRes.data.success) {
            log(`✅ Stats Loaded`);
            log(`   - Active Customers: ${statsRes.data.data.activeCustomers}`);
            log(`   - Monthly Revenue: ₹${statsRes.data.data.revenue || 0}`);
            log(`   - Orders Today: ${statsRes.data.data.ordersToday}`);
        }

        // 3. MENU CHECK
        log("\n--- [2] MENU MANAGEMENT ---");
        const menuRes = mockRes();
        await menuController.getProviderMenus(req, menuRes);
        if (menuRes.data && menuRes.data.success) {
            log(`✅ Menu List Fetched`);
            log(`   - Menus: ${menuRes.data.data.length} found`);
            menuRes.data.data.slice(0, 3).forEach(m => log(`     * ${m.menuDate}: ${m.mealType} - ${m.mainDish || "No Main Dish"}`));
        } else {
            log(`⚠️ Menu Fetch Warning: ${menuRes.data ? menuRes.data.message : "Unknown Error"}`);
        }

    } catch (err) {
        log(`\n❌ ERROR: ${err.message}`);
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

verifyProvider();
