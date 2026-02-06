const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/user.model");
const StoreProfile = require("./models/storeProfile.model");

dotenv.config();

const seedStore = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        // --- Main Provider (Idempotent) ---
        const mainEmail = "provider_seed@example.com";
        let providerId;
        const existingUser = await User.findOne({ email: mainEmail });

        if (existingUser) {
            console.log("Main Provider user already exists");
            providerId = existingUser._id;
        } else {
            const hashedPassword = await bcrypt.hash("password123", 10);
            const newUser = await User.create({
                fullName: "Seed Provider",
                email: mainEmail,
                password: hashedPassword,
                mobile: "9998887776",
                role: "provider",
                isVerified: true
            });
            providerId = newUser._id;
            console.log("Created Main Provider User");
        }

        const existingStore = await StoreProfile.findOne({ provider: providerId });
        if (!existingStore) {
            await StoreProfile.create({
                provider: providerId,
                mess_name: "Seed Annapurna Mess",
                contact_number: "9998887776",
                cuisines: ["Maharashtrian", "Thali"],
                lunch_start: "11:00 AM",
                lunch_end: "03:00 PM",
                dinner_start: "07:00 PM",
                dinner_end: "11:00 PM",
                delivery_radius_km: 5,
                location: { type: "Point", coordinates: [73.8567, 18.5204] }, // Pune
                description: "Authentic seeded mess data for testing.",
                store_image: "https://images.unsplash.com/photo-1555244162-803834f70033",
                address: { street: "FC Road", city: "Pune", state: "Maharashtra", pincode: "411004" },
                is_active: true
            });
            console.log("Created Main Store Profile");
        }

        // --- 6 Additional Providers ---
        const locations = [
            { name: "Kothrud", coords: [73.8024, 18.5074] },
            { name: "Viman Nagar", coords: [73.9143, 18.5679] },
            { name: "Hinjewadi", coords: [73.7188, 18.5913] },
            { name: "Baner", coords: [73.7868, 18.5590] },
            { name: "Hadapsar", coords: [73.9259, 18.5089] },
            { name: "Shivajinagar", coords: [73.8567, 18.5314] },
            { name: "Kolari", coords: [73.8567, 18.5314] }


        ];
        const messNames = ["Ghar ka Swad", "Mom's Kitchen", "Healthy Bytes", "Spicy Tadka", "Pune Tiffins", "Desi Tiffin", "Student's Choice"];
        const cuisinesList = [["North Indian"], ["South Indian", "Vegan"], ["Jain", "Thali"], ["Punjabi"], ["Maharashtrian"], ["Thali", "North Indian"], ["Chinese", "Thali"]];
        const contactBases = ["9001", "9002", "9003", "9004", "9005", "9006", "9007"];

        for (let i = 0; i < 7; i++) {
            const email = `provider_seed_${i + 1}@example.com`;

            let newProviderId;
            const exists = await User.findOne({ email });
            if (exists) {
                newProviderId = exists._id;
                console.log(`Provider ${i + 1} already exists`);
            } else {
                const hashedPassword = await bcrypt.hash("password123", 10);
                const user = await User.create({
                    fullName: `Provider ${messNames[i]}`,
                    email,
                    password: hashedPassword,
                    mobile: `${contactBases[i]}000000`,
                    role: "provider",
                    isVerified: true
                });
                newProviderId = user._id;
                console.log(`Created Provider User ${i + 1}`);
            }

            const storeExists = await StoreProfile.findOne({ provider: newProviderId });
            if (!storeExists) {
                await StoreProfile.create({
                    provider: newProviderId,
                    mess_name: messNames[i],
                    contact_number: `${contactBases[i]}000000`,
                    cuisines: cuisinesList[i],
                    lunch_start: "11:30 AM",
                    lunch_end: "03:30 PM",
                    dinner_start: "07:30 PM",
                    dinner_end: "11:30 PM",
                    delivery_radius_km: 4,
                    location: { type: "Point", coordinates: locations[i].coords },
                    description: `Best tiffin service in ${locations[i].name}. Home cooked meals delivered to your door.`,
                    store_image: "https://images.unsplash.com/photo-1543353071-873f17a7a088",
                    address: { street: "Main Road", city: "Pune", state: "Maharashtra", pincode: "411000", landmark: locations[i].name },
                    is_active: true
                });
                console.log(`Created Store Profile ${i + 1}`);
            }
        }

        console.log("Seeding Complete");
        process.exit();
    } catch (error) {
        console.error("Error seeding:", error);
        process.exit(1);
    }
};

seedStore();
