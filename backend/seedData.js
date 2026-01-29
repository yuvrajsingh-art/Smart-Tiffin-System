const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/user.model");
const Order = require("./models/order.model");
const Transaction = require("./models/transaction.model");
const bcrypt = require("bcryptjs");

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected for Seeding...");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        await connectDB();

        // 1. Create Providers (Master Nodes)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("123456", salt);

        const providers = [
            {
                fullName: "Spice Kitchen (Indore)",
                email: "spice@kitchen.com",
                password: hashedPassword,
                mobile: "9876543210",
                role: "provider",
                address: "Vijay Nagar, Indore",
                isVerified: true,
                status: "active"
            },
            {
                fullName: "Annapurna Rasoi",
                email: "anna@rasoi.com",
                password: hashedPassword,
                mobile: "9876543211",
                role: "provider",
                address: "Rajwada, Indore",
                isVerified: true,
                status: "active"
            }
        ];

        const savedProviders = await User.insertMany(providers);
        console.log("Providers Seeded ✅");

        // 2. Create Customers
        const customers = [
            { fullName: "Rahul Sharma", email: "rahul@test.com", password: hashedPassword, mobile: "1234567890", role: "customer", status: "active" },
            { fullName: "Sneha Gupta", email: "sneha@test.com", password: hashedPassword, mobile: "1234567891", role: "customer", status: "active" },
            { fullName: "Amit Verma", email: "amit@test.com", password: hashedPassword, mobile: "1234567892", role: "customer", status: "active" },
            { fullName: "Priya Singh", email: "priya@test.com", password: hashedPassword, mobile: "1234567893", role: "customer", status: "active" }
        ];

        const savedCustomers = await User.insertMany(customers);
        console.log("Customers Seeded ✅");

        // 3. Create Transactions (Backdated for 7 Days)
        const transactions = [];
        const now = new Date();

        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(now.getDate() - i);

            // Daily revenue (random between 500 - 5000)
            const dailyTotal = Math.floor(Math.random() * 4500) + 500;

            transactions.push({
                provider: savedProviders[0]._id,
                transactionType: "Order Payment",
                referenceId: `ORDER-ST-${1000 + i}`,
                amount: dailyTotal,
                status: "Success",
                createdAt: date
            });
        }

        await Transaction.insertMany(transactions);
        console.log("Transactions Seeded (7-Day Growth) ✅");

        // 4. Create Orders (Pulse Monitoring)
        const orderStatuses = ["Placed", "Accepted", "Preparing", "Ready", "Delivered"];
        const orders = [];

        for (let i = 0; i < 15; i++) {
            const randomCustomer = savedCustomers[Math.floor(Math.random() * savedCustomers.length)];
            const randomProvider = savedProviders[Math.floor(Math.random() * savedProviders.length)];
            const randomStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];

            orders.push({
                customer: randomCustomer._id,
                provider: randomProvider._id,
                order_type: "one-time",
                meal_type: i % 2 === 0 ? "lunch" : "dinner",
                items: [{ name: "Standard Tiffin", price: 80, quantity: 1 }],
                grandTotal: 85,
                status: randomStatus,
                delivery_location: { address_text: "Sample Address" }
            });
        }

        await Order.insertMany(orders);
        console.log("Orders Seeded (Delivery Ops) ✅");

        console.log("\n🚀 DB POPULATED! Dashboard ab real lagega.");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
