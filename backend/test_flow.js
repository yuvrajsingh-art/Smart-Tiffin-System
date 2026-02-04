const mongoose = require('mongoose');
// const axios = require('axios'); // Removed, utilizing native fetch
const StoreProfile = require('./models/storeProfile.model');
const CustomerWallet = require('./models/customerWallet.model');
const User = require('./models/user.model');
require('dotenv').config();

const API_URL = 'http://localhost:5000/api';
const TEST_USER_EMAIL = `test_cust_${Date.now()}@example.com`;
const TEST_PASS = 'password123';

async function runTest() {
    console.log('--- STARTING CUSTOMER FLOW INTEGRATION TEST ---');

    // 1. Connect to DB to get Provider and Setup Wallet
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Step 1: DB Connected');

    // Find a provider
    const store = await StoreProfile.findOne();
    if (!store) {
        console.error('CRITICAL: No provider store found in DB. Cannot test purchase.');
        process.exit(1);
    }
    const PROVIDER_ID = store._id.toString();
    console.log(`Step 2: Found Provider: ${store.mess_name} (${PROVIDER_ID})`);

    // 2. Register/Login User via API
    let token;
    let userId;

    try {
        console.log(`Step 3: Registering Test User: ${TEST_USER_EMAIL}`);
        const regRes = await fetch(`${API_URL}/auth/register-customer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: 'Integration Test User',
                email: TEST_USER_EMAIL,
                password: TEST_PASS,
                mobile: '9999999999',
                address: { street: 'Test St', city: 'Test City', pincode: '123456' }
            })
        });

        let regData;
        if (!regRes.ok) {
            console.log('Registration status:', regRes.status);
            const text = await regRes.text();
            console.log('Registration Raw Response:', text);
            // Try login if already exists (unlikely given timestamp email)
            console.log('Registration failed (maybe exists), trying login...');
        } else {
            regData = await regRes.json();
        }

        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: TEST_USER_EMAIL, password: TEST_PASS })
        });

        if (!loginRes.ok) {
            console.log('Login failed status:', loginRes.status);
            const text = await loginRes.text();
            throw new Error(`Login failed: ${text}`);
        }

        const loginData = await loginRes.json();

        if (!loginData.success) {
            throw new Error(`Login success false: ${loginData.message}`);
        }

        token = loginData.token;
        userId = loginData.user._id; // Adjust based on actual response structure
        console.log('Step 3 Success: Logged in.');

    } catch (e) {
        console.error('Auth Error:', e);
        process.exit(1);
    }

    // 3. Top-up Wallet Direct DB
    console.log('Step 4: Topping up wallet directly via DB...');
    let wallet = await CustomerWallet.findOne({ customer: userId });
    if (!wallet) {
        wallet = new CustomerWallet({ customer: userId, balance: 0 });
    }
    wallet.balance = 5000;
    await wallet.save();
    console.log('Step 4 Success: Wallet balance set to 5000');

    // 4. Purchase Subscription
    console.log('Step 5: Purchasing Subscription...');
    try {
        const buyRes = await fetch(`${API_URL}/customer/subscription/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                providerId: PROVIDER_ID,
                planName: 'Test Plan Veg',
                totalAmount: 2000,
                durationInDays: 30,
                startDate: new Date().toISOString(),
                mealType: 'Lunch',
                planType: 'veg',
                deliveryAddress: { street: 'Test St', city: 'Test City', pincode: '123456', phone: '9999999999' }
            })
        });

        const buyData = await buyRes.json();
        if (!buyData.success) {
            throw new Error(`Purchase failed: ${buyData.message}`);
        }
        console.log('Step 5 Success: Subscription Purchased');

    } catch (e) {
        console.error('Purchase Error:', e);
        process.exit(1);
    }

    // 5. Verify Active Subscription
    console.log('Step 6: Verifying Active Subscription...');
    try {
        const getRes = await fetch(`${API_URL}/customer/subscription/details`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const getData = await getRes.json();

        if (!getData.success || !getData.data?.subscription) {
            throw new Error('Subscription details not found after purchase');
        }
        console.log('Step 6 Success: Active Subscription Confirmed');

    } catch (e) {
        console.error('Verify Error:', e);
        process.exit(1);
    }

    // 6. Cancel Subscription
    console.log('Step 7: Cancelling Subscription...');
    try {
        const cancelRes = await fetch(`${API_URL}/customer/subscription/cancel`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ reason: 'Integration Test Cancellation' })
        });

        const cancelData = await cancelRes.json();
        if (!cancelData.success) {
            throw new Error(`Cancellation failed: ${cancelData.message}`);
        }
        console.log('Step 7 Success: Subscription Cancelled');
        console.log('Refund Info:', cancelData.data?.message);

    } catch (e) {
        console.error('Cancel Error:', e);
        process.exit(1);
    }

    console.log('--- TEST COMPLETED SUCCESSFULLY ---');
    process.exit(0);
}

runTest();
