const axios = require('axios');

async function registerViaApi() {
    try {
        const url = 'http://localhost:5000/api/auth/registerCustomer/customer';
        const payload = {
            fullName: 'API Customer',
            email: 'customer@gmail.com',
            password: 'password',
            mobile: '9876543210',
            address: '123 API St',
            latitude: 22.7196,
            longitude: 75.8577
        };

        console.log("Registering via API...");
        const res = await axios.post(url, payload);
        console.log("✅ Registration Success:", res.data);

    } catch (error) {
        console.error("❌ Registration Failed:", error.response ? error.response.data : error.message);
    }
}

registerViaApi();
