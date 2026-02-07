/**
 * Check Weekly Menus in Database
 * Run: node scripts/checkWeeklyMenus.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Menu = require('../models/menu.model');
const Subscription = require('../models/subscription.model');
const User = require('../models/user.model');

async function checkWeeklyMenus() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Get current week dates (Monday to Sunday)
        const today = new Date();
        const currentDay = today.getDay();
        const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

        const monday = new Date(today);
        monday.setDate(today.getDate() + mondayOffset);
        monday.setHours(0, 0, 0, 0);

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);

        console.log(`📅 Checking menus for week: ${monday.toDateString()} - ${sunday.toDateString()}\n`);

        // 1. Count total menus in DB
        const totalMenus = await Menu.countDocuments({});
        console.log(`📊 Total menus in database: ${totalMenus}`);

        // 2. Count published & approved menus for this week
        const weeklyMenus = await Menu.find({
            menuDate: { $gte: monday, $lte: sunday },
            isPublished: true,
            approvalStatus: "Approved"
        }).populate('provider', 'fullName').sort({ menuDate: 1, mealType: 1 });

        console.log(`📊 Published & Approved menus this week: ${weeklyMenus.length}\n`);

        // 3. Display menu breakdown by day
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        console.log('='.repeat(80));
        console.log('WEEKLY MENU BREAKDOWN:');
        console.log('='.repeat(80));

        weeklyMenus.forEach(menu => {
            const menuDate = new Date(menu.menuDate);
            const dayName = days[menuDate.getDay()];

            console.log(`\n${dayName} (${menuDate.toDateString()}) - ${menu.mealType.toUpperCase()}`);
            console.log(`  Provider: ${menu.provider?.fullName || 'N/A'}`);
            console.log(`  Main Dish: ${menu.mainDish || 'N/A'}`);
            console.log(`  Dal: ${menu.dal || 'N/A'}`);
            console.log(`  Rice: ${menu.rice || 'N/A'}`);
            console.log(`  Bread: ${menu.bread?.count || 0} ${menu.bread?.type || 'Roti'}`);
            console.log(`  Sabji: ${menu.sabjiDry || 'N/A'}`);
        });

        // 4. Check active subscriptions
        console.log('\n' + '='.repeat(80));
        console.log('ACTIVE SUBSCRIPTIONS:');
        console.log('='.repeat(80));

        const activeSubs = await Subscription.find({
            status: "approved",
            endDate: { $gte: new Date() }
        }).populate('customer', 'fullName email').populate('provider', 'fullName');

        console.log(`\n📊 Active subscriptions: ${activeSubs.length}\n`);

        activeSubs.slice(0, 5).forEach(sub => {
            console.log(`  ${sub.customer?.fullName || 'N/A'} -> ${sub.provider?.fullName || 'N/A'}`);
        });

        // 5. Check if any provider has menus for this week
        console.log('\n' + '='.repeat(80));
        console.log('PROVIDERS WITH MENUS THIS WEEK:');
        console.log('='.repeat(80));

        const providersWithMenus = await Menu.distinct('provider', {
            menuDate: { $gte: monday, $lte: sunday },
            isPublished: true,
            approvalStatus: "Approved"
        });

        for (const providerId of providersWithMenus) {
            const provider = await User.findById(providerId).select('fullName');
            const menuCount = await Menu.countDocuments({
                provider: providerId,
                menuDate: { $gte: monday, $lte: sunday },
                isPublished: true,
                approvalStatus: "Approved"
            });
            console.log(`\n  ${provider?.fullName || 'Unknown'}: ${menuCount} menus`);
        }

        console.log('\n✅ Check complete!');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkWeeklyMenus();
