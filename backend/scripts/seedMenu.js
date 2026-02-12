const mongoose = require('mongoose');
const Menu = require('../models/menu.model');
const User = require('../models/user.model');

const MONGO_URI = 'mongodb://localhost:27017/smart-tiffin-system';

const seedMenu = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const provider = await User.findOne({ role: 'provider' });
        if (!provider) {
            console.log('No provider found. Please create a provider first.');
            process.exit(1);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const menuData = [
            {
                provider: provider._id,
                name: 'Standard North Indian Thali',
                price: 150,
                category: 'Thali',
                type: 'Veg',
                mealType: 'lunch',
                menuDate: today,
                availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                items: [{ name: 'Paneer Butter Masala' }, { name: 'Dal Tadka' }, { name: '4 Roti' }, { name: 'Rice' }]
            },
            {
                provider: provider._id,
                name: 'Premium Punjabi Dinner',
                price: 200,
                category: 'Combo',
                type: 'Veg',
                mealType: 'dinner',
                menuDate: today,
                availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                items: [{ name: 'Dal Makhani' }, { name: 'Mix Veg' }, { name: '2 Butter Naan' }, { name: 'Jeera Rice' }]
            }
        ];

        // Clear today's menu first
        await Menu.deleteMany({
            menuDate: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
        });

        await Menu.insertMany(menuData);
        console.log('Successfully seeded today\'s menu!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding menu:', error);
        process.exit(1);
    }
};

seedMenu();
