const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { runDailyOrders } = require('../utils/scheduler');

// Load env vars
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const run = async () => {
    await connectDB();
    console.log("Triggering Daily Orders...");
    const count = await runDailyOrders();
    console.log(`Done. Created ${count} orders.`);
    process.exit();
};

run();
