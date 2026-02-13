const mongoose = require('mongoose');
const Plan = require('../models/plan.model');

const MONGO_URI = 'mongodb://localhost:27017/smart-tiffin-system';

const standardPlans = [
    {
        name: 'Standard Veg Thali',
        type: 'Veg',
        period: 'Monthly',
        price: 2500,
        description: 'Daily Veg Thali with 4 Roti, 2 Sabzi, Dal, and Rice.',
        color: 'from-emerald-400 to-emerald-600',
        badge: 'Best Value',
        isStandard: true,
        isActive: true,
        verificationStatus: 'Approved'
    },
    {
        name: 'Premium Non-Veg',
        type: 'Non-Veg',
        period: 'Monthly',
        price: 3500,
        description: 'Includes Chicken/Egg items 3 days a week plus standard thali.',
        color: 'from-rose-500 to-rose-700',
        badge: 'Popular',
        isStandard: true,
        isActive: true,
        verificationStatus: 'Approved'
    },
    {
        name: 'Weight Loss Keto',
        type: 'Diet',
        period: 'Monthly',
        price: 6000,
        description: 'Low carb, high protein keto meals for health enthusiasts.',
        color: 'from-violet-500 to-violet-700',
        badge: 'Fit Choice',
        isStandard: true,
        isActive: true,
        verificationStatus: 'Approved'
    }
];

const seedPlans = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if plans already exist
        const count = await Plan.countDocuments({ isStandard: true });
        if (count > 0) {
            console.log('Standard plans already exist. Skipping seed.');
            process.exit(0);
        }

        await Plan.insertMany(standardPlans);
        console.log('Successfully seeded standard plans!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding plans:', error);
        process.exit(1);
    }
};

seedPlans();
