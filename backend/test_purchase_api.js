const axios = require('axios');

const simulatePurchase = async () => {
    try {
        // Need to login first to get a token or use a known user ID
        // For simulation, let's assume we can hit the actual endpoint if we skip auth
        // but better to use a real token if possible.
        // Let's just try to hit it and see if we get 401 (proves it's reaching) 
        // or 400 (if we provide bad data).

        const payload = {
            providerId: "69804a2999a6499725d044cd",
            planName: "Monthly Complete",
            totalAmount: 3500,
            durationInDays: 30,
            startDate: new Date().toISOString().split('T')[0],
            mealType: "both",
            lunchTime: "12:30 PM",
            dinnerTime: "08:30 PM",
            deliveryAddress: {
                street: "Test street",
                city: "Test city",
                pincode: "123456",
                phone: "1234567890"
            },
            planType: "veg"
        };

        const response = await axios.post('http://localhost:5000/api/customer/subscription/purchase', payload);
        console.log("Response:", response.data);
    } catch (error) {
        if (error.response) {
            console.log("Status:", error.response.status);
            console.log("Data:", error.response.data);
        } else {
            console.error(error.message);
        }
    }
};

simulatePurchase();
