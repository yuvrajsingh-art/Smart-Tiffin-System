const axios = require('axios');

const verify = async () => {
    try {
        const API_URL = 'http://localhost:5000/api';

        // 1. Login Customer
        console.log("1. Logging in Customer...");
        // Use the test user we created earlier
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: "test_user_1289535091@example.com", // From previous step
            password: "password123",
            role: "customer"
        }).catch(async (e) => {
            // If login fails, maybe register a new one
            if (e.response && e.response.status >= 400) {
                const rand = Math.floor(Math.random() * 10000);
                console.log("   Login failed, registering new user...");
                return await axios.post(`${API_URL}/auth/registerCustomer/customer`, {
                    fullName: "Sub Tester",
                    email: `sub_tester_${rand}@example.com`,
                    password: "password123",
                    mobile: "9000012345",
                    role: "customer"
                });
            }
            throw e;
        });

        const token = loginRes.data.token;
        const customerId = loginRes.data.user._id;
        console.log("   Logged in as:", loginRes.data.user.email);

        // 2. Find Provider (Desi Tiffin)
        console.log("2. Finding Provider...");
        const messRes = await axios.get(`${API_URL}/discovery/find-mess`);
        const provider = messRes.data.data.find(p => p.mess_name === "Desi Tiffin") || messRes.data.data[0];
        console.log("   Target Provider:", provider.mess_name, `(${provider._id})`);

        // 3. Purchase Subscription
        console.log("3. Purchasing Subscription...");
        const payload = {
            providerId: provider.id, // API returns .id mapped from ._id
            planName: "Monthly Complete",
            price: 3500,
            startDate: new Date(),
            mealType: "both",
            addons: [{ name: "Extra Roti", quantity: 2 }]
        };

        const subRes = await axios.post(`${API_URL}/subscriptions/create`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (subRes.data.success) {
            console.log("   ✅ Success! Subscription ID:", subRes.data.data.subscription._id);
            console.log("   Status:", subRes.data.data.subscription.status);
        } else {
            console.log("   ❌ Failed:", subRes.data);
        }

    } catch (error) {
        console.error("❌ Error:", error.response ? error.response.data : error.message);
    }
};

verify();
