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

/**
 * Register a new customer
 * Required fields: fullName, email, password, mobile
 * Optional fields: address, latitude, longitude
 */
exports.registerCustomer = async (req, res) => {
  try {
    const { fullName, email, password, mobile, address, latitude, longitude } = req.body;
    console.log("📝 Incoming Registration Request:", { fullName, email, mobile });

    // Validate required fields
    if (!fullName || !email || !password || !mobile) {
      console.log("⚠️ Registration Failed: Missing fields");
      return res.status(400).json({ message: "All required fields missing" });
    }

    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      console.log("⚠️ Registration Failed: User already exists -", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data
    const userData = {
      fullName,
      email,
      password: hashedPassword,
      mobile,
      role: "customer",
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
    console.log("✅ User created successfully in DB:", user._id);
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
    console.error("❌ Register Customer Error:", error.message);
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
      return res.status(400).json({ message: "All required fields missing" });
    }

    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data
    const userData = {
      fullName,
      email,
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

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

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
    console.error("Login Error:", error.message);
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

    console.log(`👤 Profile Request: ${req.user.email} (${req.user.role})`);

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
    console.error("❌ Get Profile Error:", error.message);
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