const User = require("../models/user.model");

exports.isVerifiedProvider = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Access Denied: Your account is pending verification. Please complete your KYC or wait for admin approval."
            });
        }

        next();
    } catch (error) {
        console.error("Verification Middleware Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
