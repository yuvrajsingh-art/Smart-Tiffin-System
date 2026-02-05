const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Subscription = require('./models/subscription.model');

dotenv.config();

const clearSubs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const result = await Subscription.deleteMany({});
        console.log(`Deleted ${result.deletedCount} subscriptions`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

clearSubs();
