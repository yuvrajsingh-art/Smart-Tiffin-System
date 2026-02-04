const axios = require('axios');
const API_URL = 'http://localhost:5000/api';
const TEST_USER_EMAIL = `test_skip_${Date.now()}@example.com`;
const TEST_PASS = 'password123';

async function runTest() {
    console.log('--- STARTING SKIP MEAL VERIFICATION ---');

    try {
        // 1. Register & Login
        const regRes = await axios.post(`${API_URL}/auth/registerCustomer/customer`, {
            fullName: 'Skip Test User',
            email: TEST_USER_EMAIL,
            password: TEST_PASS,
            mobile: '8888888888',
            address: "Skip Test Address"
        });
        const { token } = regRes.data;
        console.log('Registered User.');

        const authHeader = { headers: { 'Authorization': `Bearer ${token}` } };

        // 2. Add Money
        await axios.post(`${API_URL}/customer/wallet/add-money`, { amount: 1000 }, authHeader);

        // 3. Find Provider
        const findRes = await axios.get(`${API_URL}/discovery/find-mess`);
        if (!findRes.data.success || findRes.data.data.length === 0) throw new Error('No providers');
        const providerId = findRes.data.data[0].id;
        console.log(`Found Provider: ${providerId}`);

        // 4. Buy Subscription (7 days, Both meals = 14 meals)
        const buyRes = await axios.post(`${API_URL}/customer/subscription/purchase`, {
            providerId: providerId,
            planName: 'Skip Test Plan',
            totalAmount: 700,
            durationInDays: 7,
            startDate: new Date().toISOString(),
            mealType: 'Both',
            planType: 'veg',
            deliveryAddress: { street: 'Test', city: 'Test', pincode: '123456', phone: '123' }
        }, authHeader);

        const initialBalance = buyRes.data.data.newBalance;
        console.log(`Purchased Subscription. Wallet: ₹${initialBalance}`);

        // 5. Try Skipping TODAY'S Lunch (Should fail if > 10 AM)
        console.log('Attempting to skip Today\'s Lunch (Cutoff check)...');
        const todayStr = new Date().toISOString().split('T')[0];
        try {
            const skipTodayRes = await axios.post(`${API_URL}/customer/menu/toggle-skip`, {
                date: todayStr,
                mealType: 'lunch'
            }, authHeader);
            console.warn('❌ Cutoff logic failed (Should have blocked skip if > 10 AM)');
        } catch (error) {
            if (error.response?.data?.message.includes('Cutoff time')) {
                console.log('✅ Correctly blocked Today\'s skip (Cutoff Logic OK)');
            } else {
                throw error;
            }
        }

        // 6. Skip TOMORROW'S Lunch (Should succeed)
        console.log('Attempting to skip Tomorrow\'s Lunch...');
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        const skipTomorrowRes = await axios.post(`${API_URL}/customer/menu/toggle-skip`, {
            date: tomorrowStr,
            mealType: 'lunch'
        }, authHeader);

        if (skipTomorrowRes.data.success) {
            console.log(`✅ ${skipTomorrowRes.data.message}`);

            // Check Wallet for refund
            const profileRes = await axios.get(`${API_URL}/customer/dashboard/`, authHeader);
            const newBalance = profileRes.data.data.walletBalance;

            // Refund = 700 / 14 = 50
            if (newBalance === initialBalance + 50) {
                console.log(`✅ Refund Exact: ₹50 added. New Balance: ₹${newBalance}`);
            } else {
                console.log(`❌ Refund Mismatch. Expected ${initialBalance + 50}, got ${newBalance}`);
            }
        }

        // 7. Resume TOMORROW'S Lunch (Unskip)
        console.log('Attempting to resume Tomorrow\'s Lunch...');
        const resumeRes = await axios.post(`${API_URL}/customer/menu/toggle-skip`, {
            date: tomorrowStr,
            mealType: 'lunch'
        }, authHeader);

        if (resumeRes.data.success) {
            console.log(`✅ ${resumeRes.data.message}`);
            const profileRes2 = await axios.get(`${API_URL}/customer/dashboard/`, authHeader);
            const profileData2 = profileRes2.data.data;
            if (profileData2.walletBalance === initialBalance) {
                console.log(`✅ Deduction Exact: ₹50 deducted back. Balance restored to ₹${initialBalance}`);
            } else {
                console.log(`❌ Balance restore failed. Current: ${profileData2.walletBalance}`);
            }
        }

        console.log('--- TEST FINISHED ---');
        process.exit(0);
    } catch (e) {
        console.error('ERROR:', e.response?.data || e.message);
        process.exit(1);
    }
}

runTest();
