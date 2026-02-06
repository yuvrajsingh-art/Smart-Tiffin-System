const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

async function checkDb() {
    try {
        console.log("Connecting...");
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Smart-Tiffin-System');
        console.log("✅ Connected to:", mongoose.connection.name);

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));

    } catch (err) {
        console.error("❌ Connection Failed:", err);
    } finally {
        await mongoose.disconnect();
    }
}

checkDb();
