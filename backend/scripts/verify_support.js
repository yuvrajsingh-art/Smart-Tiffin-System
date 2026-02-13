const mongoose = require('mongoose');
const User = require('../models/user.model');
const Ticket = require('../models/ticket.model');
const Order = require('../models/order.model');
require('dotenv').config();

const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '..', 'support_test_log.txt');
const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
};

const verifySupportFlow = async () => {
    fs.writeFileSync(logFile, ''); // Clear old log
    try {
        await mongoose.connect(process.env.MONGO_URI);
        log("✅ DB Connected");

        // 1. Find a Customer and a Provider
        const customer = await User.findOne({ role: 'customer' });
        const provider = await User.findOne({ role: 'provider' });

        if (!customer || !provider) {
            console.log("❌ Missing customer or provider");
            process.exit(1);
        }

        console.log(`👤 Customer: ${customer.fullName} (${customer._id})`);
        console.log(`👨‍🍳 Provider: ${provider.fullName} (${provider._id})`);

        // 2. Find an Order linked to this Provider (mock one if needed)
        // We need an order where provider is this provider
        // Actually, let's just create a Ticket directly to simulate "Report Issue"

        console.log("📝 Creating Test Ticket...");
        const ticket = await Ticket.create({
            user: customer._id,
            issue: "Test Issue - Food Cold",
            description: "The food was delivery cold and late.",
            priority: "High",
            relatedProvider: provider._id, // Vital for provider to see it
            status: "New",
            messages: [{
                sender: 'user',
                text: "The food was delivery cold and late.",
                time: new Date()
            }]
        });

        console.log(`✅ Ticket Created: ${ticket._id}`);

        // 3. Simulate Provider Fetching Tickets
        console.log("👨‍🍳 Simulating Provider fetching tickets...");
        const providerTickets = await Ticket.find({ relatedProvider: provider._id });

        const found = providerTickets.find(t => t._id.toString() === ticket._id.toString());
        if (found) {
            console.log("✅ Provider successfully sees the new ticket!");
        } else {
            console.log("❌ Provider CANNOT see the ticket. Check 'relatedProvider' field.");
        }

        // 4. Simulate Provider Reply
        console.log("💬 Simulating Provider Reply...");
        found.messages.push({
            sender: 'admin', // As per our controller logic for now
            text: "Sorry for the inconvenience. We are issuing a refund.",
            time: new Date()
        });
        found.status = 'In Review';
        await found.save();
        console.log("✅ Provider Reply Saved & Status Updated to 'In Review'");

        // 5. Cleanup
        console.log("🧹 Cleaning up test ticket...");
        await Ticket.findByIdAndDelete(ticket._id);
        console.log("✅ Cleanup Complete");

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        mongoose.disconnect();
    }
};

verifySupportFlow();
