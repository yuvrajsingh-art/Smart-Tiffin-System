/**
 * =============================================================================
 * SMART TIFFIN SYSTEM - BACKEND SERVER
 * =============================================================================
 * Main entry point for the Express.js backend server
 * 
 * Features:
 * - RESTful API endpoints
 * - MongoDB database connection
 * - JWT authentication
 * - Role-based access control (Customer, Provider, Admin)
 * =============================================================================
 */

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const initScheduledJobs = require("./utils/scheduler");

// Load environment variables
dotenv.config();

const http = require("http");
const { Server } = require("socket.io");

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  },
  transports: ['websocket', 'polling'], // Allow both transports
  allowEIO3: true // Backward compatibility
});


// Socket.io Connection Logic
io.on("connection", (socket) => {

  console.log(`🔌 New Client Connected: ${socket.id}`);

  // Test Event for Admin Panel Verification
  socket.on('test-new-order', () => {
    console.log("🔔 Received Test Order Trigger");
    io.emit('new-order', {
      order: {
        id: `TEST-${Math.floor(Math.random() * 1000)}`,
        customer: 'Test User (Simulated)',
        kitchen: 'Demo Kitchen',
        type: 'Test Order',
        status: 'Preparing',
        time: new Date().toLocaleTimeString(),
        zone: 'Test Zone',
        rider: 'Searching...'
      }
    });
  });

  socket.on("disconnect", () => {

    console.log(`❌ Client Disconnected: ${socket.id}`);
  });
});

// Make io accessible globally or export it (attaching to req is easiest for controllers)
app.use((req, res, next) => {
  req.io = io;
  next();
});

// =============================================================================
// MIDDLEWARE
// =============================================================================

// CORS - Allow frontend to communicate with backend
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Request Logger - Log all API requests in development
const requestLogger = require('./middleware/requestLogger.middleware');
app.use(requestLogger);

// =============================================================================
// ROUTES IMPORT
// =============================================================================

// Authentication routes
const authRoutes = require("./routes/authRoutes");

// Provider routes
const providerOnboardingRoutes = require("./routes/provider/providerOnboarding.routes");
const providerMenuRoutes = require("./routes/provider/providerMenuRoutes");
const providerDashboardRoutes = require("./routes/provider/providerDeshbordRoutes");
const kdsRoutes = require("./routes/provider/kdsRoutes");
const subscriptionRoutes = require("./routes/provider/subscriptionRoutes");
const walletRoutes = require("./routes/provider/walletRoutes");
const reviewTriageRoutes = require("./routes/provider/reviewTriageRoutes");
const storeProfileRoutes = require("./routes/provider/storeProfileRoutes");

// Admin routes
const adminRoutes = require("./routes/adminRoutes");

// Customer routes
const customerDashboardRoutes = require("./routes/customer/customerDashboardRoutes");
const customerWalletRoutes = require("./routes/customer/walletRoutes");
const customerMenuRoutes = require("./routes/customer/menuRoutes");
const messDiscoveryRoutes = require("./routes/customer/messDiscoveryRoutes");
const customerFeedbackRoutes = require("./routes/customer/feedbackRoutes");
const customerHistoryRoutes = require("./routes/customer/historyRoutes");
const customerTrackRoutes = require("./routes/customer/trackRoutes");
const customerSubscriptionRoutes = require("./routes/customer/subscriptionRoutes");
const customerProfileRoutes = require("./routes/customer/profileRoutes");

// =============================================================================
// ROUTES REGISTRATION
// =============================================================================

// Health check endpoint
app.get("/", (req, res) => {
  res.send("API running & DB connected");
});

// Auth endpoints: /api/auth/*
app.use("/api/auth", authRoutes);

// Provider endpoints: /api/provider-*
app.use("/api/provider-onboarding", providerOnboardingRoutes);
app.use("/api/provider-menus", providerMenuRoutes);
app.use("/api/provider-deshbord", providerDashboardRoutes);
app.use("/api/provider-kds", kdsRoutes);
app.use("/api/provider-subscription", subscriptionRoutes);
app.use("/api/provider-wallet", walletRoutes);
app.use("/api/provider-reviews", reviewTriageRoutes);
app.use("/api/provider-store", storeProfileRoutes);

// Admin endpoints: /api/admin/*
app.use("/api/admin", adminRoutes);

// Customer endpoints: /api/customer/* and /api/discovery/*
app.use("/api/customer/dashboard", customerDashboardRoutes);
app.use("/api/customer/wallet", customerWalletRoutes);
app.use("/api/customer/menu", customerMenuRoutes);
app.use("/api/discovery", messDiscoveryRoutes);
app.use("/api/customer/feedback", customerFeedbackRoutes);
app.use("/api/customer/history", customerHistoryRoutes);
app.use("/api/customer/track", customerTrackRoutes);
app.use("/api/customer/subscription", customerSubscriptionRoutes);
app.use("/api/customer/profile", customerProfileRoutes);

// =============================================================================
// CONSOLE COLORS & STYLING
// =============================================================================

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  // Foreground colors
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  // Background colors
  bgGreen: '\x1b[42m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset}  ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset}  ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset}  ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset}  ${msg}`),
  server: (msg) => console.log(`${colors.magenta}◉${colors.reset}  ${msg}`),
};

// =============================================================================
// START SERVER
// =============================================================================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`\n🚀 Server is LIVE!\n🌐 API URL: http://localhost:${PORT}\n🗄️  Database: MongoDB Connected\n🔑 Auth: JWT Enabled\n`);

  // Initialize Cron Jobs
  initScheduledJobs();
  console.log('Scheduled jobs initialized');
});
