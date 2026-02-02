const axios = require('axios');

async function testRegistration() {
    try {
        const payload = {
            fullName: "Test User " + Date.now(),
            email: "test_" + Date.now() + "@gmail.com",
            password: "password123",
            mobile: "9876543210",
            address: "Test Address, Pune"
        };

        console.log("🚀 Sending registration request for:", payload.email);
        const response = await axios.post('http://localhost:5000/api/auth/registerCustomer/customer', payload);

        console.log("✅ Registration Successful!");
        console.log("Status:", response.status);
        console.log("Response Data:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("❌ Registration Failed!");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Error Detail:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Error Message:", error.message);
        }
    }
}

testRegistration();
