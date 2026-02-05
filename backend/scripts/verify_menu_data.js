const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Subscription = require('./models/subscription.model');
const Menu = require('./models/menu.model');
const User = require('./models/user.model');

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB Atlas");

        const allUsers = await User.find({});
        console.log(`\nTotal Users: ${allUsers.length}`);
        allUsers.forEach(u => console.log(`- ${u.fullName} (${u.email}) [${u.role}] ID: ${u._id}`));

        const allSubs = await Subscription.find({});
        console.log(`\nTotal Subscriptions: ${allSubs.length}`);
        allSubs.forEach(s => console.log(`- ID: ${s._id}, Customer: ${s.customer}, Status: ${s.status}, EndDate: ${s.endDate}`));

        const allMenus = await Menu.find({});
        console.log(`\nTotal Menus: ${allMenus.length}`);
        allMenus.forEach(m => console.log(`- ${m.mealType}: ${m.name} [${m.menuDate.toISOString().split('T')[0]}] Published: ${m.isPublished}, Approval: ${m.approvalStatus}`));

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkData();
