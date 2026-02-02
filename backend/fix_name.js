const mongoose = require("mongoose");
const dotenv = require("dotenv");
const StoreProfile = require("./models/storeProfile.model");

dotenv.config();

const fixName = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        // Update the one that was supposed to be Desi Tiffin
        // Based on the array index logic, it was likely the 6th seeded one (index 5)
        // But since emails are unique, let's target the user created by loop index 5
        // email: provider_seed_6@example.com (because i=5, email=i+1=6) 

        // Actually, looking at previous logs: "Provider 6 already exists".
        // AND "Created Store Profile 6". 
        // Wait, the output showed "Student's Choice" twice. 
        // Let's just find the one with name "Student's Choice" and update it if it's not the last one?
        // Safer: Update by email relation.

        // Let's just update the profile directly where mess_name is "Student's Choice" but maybe the last added one?
        // Simpler: Just findOneAndUpdate mess_name="Student's Choice" to "Desi Tiffin" (careful not to update the real one).

        // Better approach: Find all with "Student's Choice". Update the second one.
        const profiles = await StoreProfile.find({ mess_name: "Student's Choice" });
        if (profiles.length > 0) {
            // Update the last one found (most recently created or duplicate)
            const target = profiles[profiles.length - 1];
            target.mess_name = "Desi Tiffin";
            await target.save();
            console.log("Updated profile id " + target._id + " to Desi Tiffin");
        } else {
            console.log("No Student's Choice found to update");
        }

        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

fixName();
