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
const userSockets = new Map(); // Track user connections

io.on("connection", (socket) => {
  console.log(`🔌 New Client Connected: ${socket.id}`);

  // User authentication and room joining
  socket.on('authenticate', (userId) => {
    if (userId) {
      socket.join(`user_${userId}`);
      userSockets.set(userId, socket.id);
      console.log(`✅ User ${userId} authenticated and joined room user_${userId}`);
      console.log(`📊 Total users in room: ${io.sockets.adapter.rooms.get(`user_${userId}`)?.size || 0}`);
    } else {
      console.log('⚠️ Authentication failed: No userId provided');
    }
  });

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
    // Remove user from tracking
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        console.log(`❌ User ${userId} disconnected`);
        break;
      }
    }
    console.log(`❌ Client Disconnected: ${socket.id}`);
  });
});

// Make io accessible globally
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Initialize notification service with socket.io
const notificationService = require('./utils/notificationService');
notificationService.setSocketIO(io);

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
app.use(express.urlencoded({ extended: true }));

// Debug Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

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
const providerOrderRoutes = require("./routes/provider/providerOrderRoutes");
const providerNotificationRoutes = require("./routes/provider/providerNotificationRoutes");
const subscriptionPlanRoutes = require("./routes/provider/subscriptionPlanRoutes");
const activityRoutes = require("./routes/provider/activityRoutes");

// Admin routes
const adminRoutes = require("./routes/adminRoutes");

// Customer routes consolidated
const customerRoutes = require("./routes/customer");

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
app.use("/api/provider-orders", providerOrderRoutes);
app.use("/api/notifications", providerNotificationRoutes);
app.use("/api/provider", subscriptionPlanRoutes);
app.use("/api/provider/activities", activityRoutes);

// Admin endpoints: /api/admin/*
app.use("/api/admin", adminRoutes);

// Customer endpoints: /api/customer/* and /api/discovery/*
app.use("/api/customer", customerRoutes);
app.use("/api/discovery", require("./routes/customer/messDiscoveryRoutes"));

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

// =============================================================================
// START SERVER
// =============================================================================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log('');
  console.log(`${colors.cyan}${colors.bright}`);
  console.log('  ╔═══════════════════════════════════════════════════════════════╗');
  console.log('  ║                                                               ║');
  console.log('  ║   🍱  SMART TIFFIN SYSTEM                                     ║');
  console.log('  ║       Backend API Server                                      ║');
  console.log('  ║                                                               ║');
  console.log('  ╚═══════════════════════════════════════════════════════════════╝');
  console.log(`${colors.reset}`);
  console.log('');

  console.log(`${colors.dim}─────────────────────────────────────────────────────────────────${colors.reset}`);
  console.log('');

  log.success(`${colors.green}${colors.bright}Server is LIVE!${colors.reset}`);
  console.log('');

  console.log(`  ${colors.bright}🌐 API URL:${colors.reset}        ${colors.cyan}http://localhost:${PORT}${colors.reset}`);
  console.log(`  ${colors.bright}📡 Socket.io:${colors.reset}      ${colors.cyan}ws://localhost:${PORT}${colors.reset}`);
  console.log(`  ${colors.bright}🗄️  Database:${colors.reset}       ${colors.green}MongoDB Connected${colors.reset}`);
  console.log(`  ${colors.bright}🔑 Auth:${colors.reset}           ${colors.green}JWT Enabled${colors.reset}`);
  console.log('');

  console.log(`${colors.dim}─────────────────────────────────────────────────────────────────${colors.reset}`);
  console.log('');

  console.log(`  ${colors.bright}📋 Available Routes:${colors.reset}`);
  console.log(`     ${colors.yellow}├──${colors.reset} /api/auth          ${colors.dim}Authentication${colors.reset}`);
  console.log(`     ${colors.yellow}├──${colors.reset} /api/admin         ${colors.dim}Admin Panel${colors.reset}`);
  console.log(`     ${colors.yellow}├──${colors.reset} /api/provider-*    ${colors.dim}Provider APIs${colors.reset}`);
  console.log(`     ${colors.yellow}└──${colors.reset} /                  ${colors.dim}Health Check${colors.reset}`);
  console.log('');

  console.log(`${colors.dim}─────────────────────────────────────────────────────────────────${colors.reset}`);
  console.log('');

  log.info(`Environment: ${colors.yellow}${process.env.NODE_ENV || 'development'}${colors.reset}`);
  log.info(`Started at: ${colors.yellow}${new Date().toLocaleString()}${colors.reset}`);
  console.log('');

  console.log(`  ${colors.green}${colors.bright}🚀 Ready to accept connections!${colors.reset}`);
  console.log('');
  console.log(`${colors.dim}═══════════════════════════════════════════════════════════════${colors.reset}`);
  console.log('');

  // Initialize Cron Jobs
  // Initialize Cron Jobs
  initScheduledJobs();
  console.log('Scheduled jobs initialized');

  // Initialize DB Watcher (For Manual Updates)
  const watchOrders = require('./utils/dbWatcher');
  if (process.env.NODE_ENV !== 'production') {
    watchOrders(io);
  }
});
