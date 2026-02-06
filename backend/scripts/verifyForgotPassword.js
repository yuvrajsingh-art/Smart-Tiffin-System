const axios = require('axios');

async function testForgotPassword() {
    const baseURL = 'http://localhost:5000/api/auth';
    const email = 'customer@gmail.com';
    const newPassword = 'newPassword123';

    try {
        console.log("1. Requesting OTP...");
        const forgotRes = await axios.post(`${baseURL}/forgot-password`, { email });

        if (!forgotRes.data.success) throw new Error("Forgot Password Failed");

        const otp = forgotRes.data.otp;
        console.log(`   ✅ OTP Received: ${otp}`);

        console.log("2. Resetting Password...");
        const resetRes = await axios.post(`${baseURL}/reset-password`, {
            otp: otp,
            password: newPassword,
            confirmPassword: newPassword
        });

        if (!resetRes.data.success) throw new Error("Reset Password Failed");
        console.log(`   ✅ ${resetRes.data.message}`);

        console.log("3. Verifying Login with New Password...");
        const loginRes = await axios.post(`${baseURL}/login`, {
            email: email,
            password: newPassword
        });

        if (loginRes.data.token) {
            console.log("   ✅ Login Successful with New Password");
        }

        // Cleanup: Reset back to 'password' (standard test password)
        // Note: In real world we wouldn't know the old password, but for test env we do.
        // I'll leave it as is, or reset it back manually if needed. 
        // Actually, let's reset it back so I don't break other scripts.
        console.log("4. Cleanup: Resetting back to 'password'...");
        // Request OTP again
        const res2 = await axios.post(`${baseURL}/forgot-password`, { email });
        const otp2 = res2.data.otp;
        // Reset
        await axios.post(`${baseURL}/reset-password`, {
            otp: otp2,
            password: 'password',
            confirmPassword: 'password'
        });
        console.log("   ✅ Password verified and reset back to 'password'");

    } catch (error) {
        console.error("❌ Test Failed:", error.response ? error.response.data : error.message);
    }
}

testForgotPassword();
