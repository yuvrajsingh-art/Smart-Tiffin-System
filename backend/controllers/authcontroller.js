/**
 * =============================================================================
 * AUTHENTICATION CONTROLLER
 * =============================================================================
 * Handles user authentication operations:
 * - Customer registration
 * - Provider registration
 * - User login
 * - Profile management
 * - Google OAuth
 * - Session management (signout)
 * =============================================================================
 */

const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Generate JWT token for authenticated user
 * @param {Object} user - User document from database
 * @returns {String} JWT token valid for 7 days
 */
const genToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// =============================================================================
// REGISTRATION
// =============================================================================

const Customer = require("../models/customer.model");

/**
 * Register a new customer
 * Required fields: fullName, email, password, mobile
 * Optional fields: address, latitude, longitude
 */
exports.registerCustomer = async (req, res) => {
  try {
    const { fullName, email, password, mobile, address, latitude, longitude } = req.body;
    logger.auth("Register Attempt", { email, role: "customer" });

    // Validate required fields
    if (!fullName || !email || !password || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Strict Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Mobile Number Validation (10 digits)
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({ message: "Mobile number must be exactly 10 digits" });
    }

    // Password Length Validation
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const normalizedEmail = email.toLowerCase().trim();
    const userExist = await User.findOne({ email: normalizedEmail });
    if (userExist) {
      return res.status(400).json({ message: "This email is already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data
    const userData = {
      fullName,
      email: normalizedEmail,
      password: hashedPassword,
      mobile,
      role: "customer",
      // Removed address and location from User model in new architecture, 
      // but keeping them for now if we want backward compatibility or just ignoring them here 
      // and putting them in Customer model.
      // Actually, User model still has address field in Mongoose? 
      // I should put address in Customer model now.
    };

    // Create user
    const user = await User.create(userData);

    // Create Customer Profile
    const customerData = {
      user: user._id,
      dietPreference: "Pure Veg", // Default
      addresses: address ? [{ label: 'Home', line: address, isDefault: true }] : []
    };

    const customer = await Customer.create(customerData);

    logger.auth("Register Success", { id: user._id, role: "customer" });
    const token = genToken(user);

    // Notify Admin via Socket.io
    if (req.io) {
      req.io.emit('admin-notification', {
        type: 'new-user',
        title: 'New Customer Joined',
        message: `${fullName} has just registered as a customer.`,
        data: { id: user._id, role: 'customer' },
        time: new Date().toLocaleTimeString()
      });
    }

    res.status(201).json({
      message: "Customer registered successfully",
      token,
      user
    });

  } catch (error) {
    logger.error("Register Error", { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

/**
 * Register a new provider (kitchen/tiffin service)
 * Required fields: fullName, email, password, mobile
 * Optional fields: address, latitude, longitude
 */
exports.providerCustomer = async (req, res) => {
  try {
    const { fullName, email, password, mobile, address, latitude, longitude } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Strict Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Mobile Number Validation
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({ message: "Mobile number must be exactly 10 digits" });
    }

    // Password Length Validation
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const normalizedEmail = email.toLowerCase().trim();
    const userExist = await User.findOne({ email: normalizedEmail });
    if (userExist) {
      return res.status(400).json({ message: "This email is already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data
    const userData = {
      fullName,
      email: normalizedEmail,
      password: hashedPassword,
      mobile,
      role: "provider",
      address
    };

    // Add location if provided
    if (latitude && longitude) {
      userData.location = {
        type: "Point",
        coordinates: [longitude, latitude]
      };
    }

    // Create user
    const user = await User.create(userData);
    const token = genToken(user);

    // Notify Admin via Socket.io
    if (req.io) {
      req.io.emit('admin-notification', {
        type: 'new-provider',
        title: 'New Provider Registration',
        message: `${fullName} is requesting to join as a provider.`,
        data: { id: user._id, role: 'provider' },
        time: new Date().toLocaleTimeString()
      });
    }

    res.status(201).json({
      message: "Provider registered successfully",
      token,
      user
    });

  } catch (error) {
    console.error("Register Provider Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// =============================================================================
// LOGIN
// =============================================================================

/**
 * Login user (all roles - customer, provider, admin)
 * Required fields: email, password
 * Returns: token, user info
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    logger.auth("Login Attempt", { email: normalizedEmail });

    // Check user exists
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      logger.warn("Login Failed: User Not Found", { email: normalizedEmail });
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn("Login Failed: Invalid Password", { email: normalizedEmail });
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    logger.auth("Login Success", { id: user._id, role: user.role });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.fullName,
        role: user.role
      }
    });

  } catch (error) {
    logger.error("Login Error", { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

// =============================================================================
// PROFILE
// =============================================================================

/**
 * Get current user's profile
 * Requires: Valid JWT token (handled by protect middleware)
 */
exports.getProfile = async (req, res) => {
  try {
    // req.user is set by protect middleware
    if (!req.user) {
      console.error("❌ Get Profile: req.user missing after middleware");
      return res.status(404).json({ message: "User not found" });
    }

    // console.log(`👤 Profile Request: ${req.user.email} (${req.user.role})`);

    res.status(200).json({
      user: {
        id: req.user._id,
        name: req.user.fullName || "User",
        role: req.user.role,
        email: req.user.email,
        mobile: req.user.mobile || "N/A",
        address: req.user.address || "",
        dietPreference: req.user.dietPreference || "Pure Veg",
        memberSince: req.user.createdAt || new Date()
      }
    });

  } catch (error) {
    logger.error("❌ Get Profile CRITICAL Failure", {
      message: error.message,
      stack: error.stack,
      user: req.user ? req.user._id : 'No User'
    });
    res.status(500).json({
      message: "Internal Server Error while fetching profile",
      error: error.message
    });
  }
};

// =============================================================================
// SESSION MANAGEMENT
// =============================================================================

/**
 * Sign out user (clear cookie)
 */
exports.signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Sign out successfully" });
  } catch (error) {
    console.error("Sign Out Error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

// =============================================================================
// PASSWORD RESET (OTP BASED)
// =============================================================================

/**
 * Forgot Password - Generate OTP
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ message: "Email not registered" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP and save to DB
    const crypto = require('crypto');
    user.resetPasswordToken = crypto.createHash('sha256').update(otp).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 Minutes

    await user.save();

    // In a real app, send email here. 
    // For this request, we return OTP in response to show in Toast.
    logger.info(`OTP generated for ${email}: ${otp}`);

    res.status(200).json({
      success: true,
      message: "OTP generated",
      otp: otp // ⚠️ DEBUG/DEMO ONLY: Returning OTP to frontend
    });

  } catch (error) {
    logger.error("Forgot Password Error", { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update Password (from profile)
 */
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {
    logger.error("updatePassword Error:", error);
    res.status(500).json({ message: "Failed to update password" });
  }
};

/**
 * Reset Password - Verify OTP and Set New Password
 */
exports.resetPassword = async (req, res) => {
  try {
    const { otp, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash OTP to match with DB
    const crypto = require('crypto');
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedOtp,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Set new password
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful! Please login."
    });

  } catch (error) {
    logger.error("Reset Password Error", { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

// =============================================================================
// GOOGLE OAUTH
// =============================================================================

/**
 * Handle Google OAuth login/registration
 * Creates user if doesn't exist, otherwise logs them in
 */
exports.googleAuth = async (req, res) => {
  try {
    const { fullName, email, mobile, role } = req.body;

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ fullName, email, mobile, role });
    }

    // Generate token
    const token = genToken(user);

    // Set cookie
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true
    });

    return res.status(200).json(user);

  } catch (error) {
    console.error("Google Auth Error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};