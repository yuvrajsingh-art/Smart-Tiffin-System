const http = require('http');

const payload = JSON.stringify({
    fullName: "Test User " + Date.now(),
    email: "test_" + Date.now() + "@gmail.com",
    password: "password123",
    mobile: "9876543210",
    address: "Test Address, Pune"
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/registerCustomer/customer',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
    }
};

console.log("🚀 Sending registration request for:", JSON.parse(payload).email);

const req = http.request(options, (res) => {
    let data = '';
    console.log(`STATUS: ${res.statusCode}`);

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('BODY: ' + data);
        if (res.statusCode === 201) {
            console.log("✅ Registration Successful!");
        } else {
            console.log("❌ Registration Failed!");
        }
    });
});

req.on('error', (e) => {
    console.error(`❌ Problem with request: ${e.message}`);
});

req.write(payload);
req.end();
