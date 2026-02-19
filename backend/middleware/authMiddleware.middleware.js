const jwt = require("jsonwebtoken");
const User = require("../models/user.model");


// ================= AUTH CHECK =================

exports.protect = async (req, res, next) => {
  let token;

  // 1. Extract token from header or query
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.query.token) {
    token = req.query.token;
  }

  if (token) {
    try {
      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // console.log(`🔑 Auth: Token verified for user ID: ${decoded.id}`);

      // 3. Get user from token
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        console.error(`❌ Auth: User not found in DB for ID: ${decoded.id}`);
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(`❌ Auth: Token verification failed: ${error.message}`);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    // console.warn(`⚠️ Auth: No token provided for protected route: ${req.originalUrl}`);
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// ================= ROLE CHECK =================
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied for this role" });
    }
    next();
  };
};

// Customer only access
exports.customerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'customer') {
    next();
  } else {
    res.status(403).json({ success: false, message: "Access denied. Customers only." });
  }
};

// Provider only access
exports.providerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'provider') {
    next();
  } else {
    res.status(403).json({ success: false, message: "Access denied. Providers only." });
  }
};

// Admin only access
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: "Access denied. Admins only." });
  }
};
