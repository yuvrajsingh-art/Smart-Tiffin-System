const API_URL = 'http://localhost:5000/api';
const TEST_USER_EMAIL = `test_flow_${Date.now()}@example.com`;
const TEST_PASS = 'password123';

async function runTest() {
    console.log('--- STARTING CUSTOMER FLOW API TEST ---');
    console.log(`Target: ${API_URL}`);

    try {
        // 1. Register
        console.log(`Step 1: Registering ${TEST_USER_EMAIL}...`);
        const regRes = await fetch(`${API_URL}/auth/registerCustomer/customer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: 'API Test User',
                email: TEST_USER_EMAIL,
                password: TEST_PASS,
                mobile: '9999999999',
                address: "Test Address String"
            })
        });

        if (!regRes.ok) {
            const text = await regRes.text();
            throw new Error(`Registration Failed: ${text}`);
        }
        const regData = await regRes.json();
        const token = regData.token;
        console.log('Step 1 Success: Registered & Got Token');

        // 2. Add Money to Wallet
        console.log('Step 2: Adding Money to Wallet...');
        const walletRes = await fetch(`${API_URL}/customer/wallet/add-money`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount: 5000 })
        });

        if (!walletRes.ok) {
            const text = await walletRes.text();
            throw new Error(`Wallet Top-up Failed: ${text}`);
        }
        console.log('Step 2 Success: Added ₹5000');

        // 3. Find Provider
        console.log('Step 3: Finding Provider...');
        const findRes = await fetch(`${API_URL}/discovery/find-mess`);
        const findData = await findRes.json();

        if (!findData.success || findData.data.length === 0) {
            throw new Error('No providers found. Cannot proceed.');
        }
        const providerId = findData.data[0].id;
        console.log(`Step 3 Success: Found Provider ${findData.data[0].name} (${providerId})`);

        // 4. Purchase Subscription
        console.log('Step 4: Purchasing Subscription...');
        const buyRes = await fetch(`${API_URL}/customer/subscription/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                providerId: providerId,
                planName: 'API Test Plan',
                totalAmount: 2000,
                durationInDays: 30,
                startDate: new Date().toISOString(),
                mealType: 'Lunch', // Capitalized to match Enum if needed, or normalized by backend
                planType: 'veg',
                deliveryAddress: { street: 'Test St', city: 'Test City', pincode: '123456', phone: '9999999999' }
            })
        });

        if (!buyRes.ok) {
            const text = await buyRes.text();
            throw new Error(`Purchase Failed: ${text}`);
        }
        const buyData = await buyRes.json();
        console.log(`Step 4 Success: Purchased. New Balance: ${buyData.data.newBalance}`);

        // 5. Verify Active Subscription
        console.log('Step 5: Verifying Subscription...');
        const getRes = await fetch(`${API_URL}/customer/subscription/details`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const getData = await getRes.json();

        if (!getData.success || !getData.data?.subscription) {
            throw new Error('Subscription not active after purchase');
        }
        const subId = getData.data.subscription.id;
        console.log(`Step 5 Success: Active Subscription ID: ${subId}`);

        // 6. Cancel Subscription
        console.log('Step 6: Cancelling Subscription...');
        const cancelRes = await fetch(`${API_URL}/customer/subscription/cancel`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Assuming cancel uses token for user ID
            },
            body: JSON.stringify({ reason: 'API Flow Test Cancel' })
        });

        if (!cancelRes.ok) {
            const text = await cancelRes.text();
            throw new Error(`Cancellation Failed: ${text}`);
        }
        const cancelData = await cancelRes.json();
        console.log('Step 6 Success: Subscription Cancelled');
        console.log('Refund Message:', cancelData.data.message);

        console.log('--- TEST PASSED ---');
        process.exit(0);

    } catch (e) {
        console.error('TEST FAILED:', e.message);
        process.exit(1);
    }
}

runTest();
