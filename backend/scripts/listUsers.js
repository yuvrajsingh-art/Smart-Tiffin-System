const mongoose = require('mongoose');
const User = require('../models/user.model');
require('dotenv').config({ path: '../.env' });

async function listUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Smart-Tiffin-System');
        const users = await User.find({}, 'fullName email role');
        console.log(JSON.stringify(users, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

listUsers();
