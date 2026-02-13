// Check Subscription Data
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Error:', err));

const Subscription = require('./models/subscription.model');

async function checkSubscriptions() {
    try {
        const subs = await Subscription.find({
            status: { $in: ["approved", "active"] }
        }).select('_id customer pauseFrom pauseTo endDate status');

        console.log(`\n📊 Total Subscriptions: ${subs.length}\n`);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        subs.forEach(sub => {
            let calculatedStatus = 'active';
            
            if (sub.endDate < today) {
                calculatedStatus = 'expired';
            } else if (
                sub.pauseFrom &&
                sub.pauseTo &&
                new Date(sub.pauseFrom) <= today &&
                new Date(sub.pauseTo) >= today
            ) {
                calculatedStatus = 'paused';
            }

            console.log(`ID: ${sub._id}`);
            console.log(`  DB Status: ${sub.status}`);
            console.log(`  Calculated: ${calculatedStatus}`);
            console.log(`  pauseFrom: ${sub.pauseFrom}`);
            console.log(`  pauseTo: ${sub.pauseTo}`);
            console.log(`  endDate: ${sub.endDate}`);
            console.log('---');
        });

        const active = subs.filter(s => {
            if (s.endDate < today) return false;
            if (s.pauseFrom && s.pauseTo && 
                new Date(s.pauseFrom) <= today && 
                new Date(s.pauseTo) >= today) return false;
            return true;
        }).length;

        const paused = subs.filter(s => {
            if (s.endDate < today) return false;
            return s.pauseFrom && s.pauseTo && 
                   new Date(s.pauseFrom) <= today && 
                   new Date(s.pauseTo) >= today;
        }).length;

        const expired = subs.filter(s => s.endDate < today).length;

        console.log(`\n✅ Summary:`);
        console.log(`Active: ${active}`);
        console.log(`Paused: ${paused}`);
        console.log(`Expired: ${expired}`);
        console.log(`Total: ${subs.length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkSubscriptions();
