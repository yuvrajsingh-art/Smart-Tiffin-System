const mongoose = require("mongoose");

// Console colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

const connectDB = async () => {
  try {
    console.log('');
    console.log(`${colors.cyan}⏳${colors.reset} Connecting to MongoDB...`);

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`${colors.green}✓${colors.reset}  ${colors.bright}MongoDB Connected Successfully!${colors.reset}`);
    console.log(`   ${colors.dim}├── Host:${colors.reset}     ${colors.cyan}${conn.connection.host}${colors.reset}`);
    console.log(`   ${colors.dim}├── Database:${colors.reset} ${colors.cyan}${conn.connection.name}${colors.reset}`);
    console.log(`   ${colors.dim}└── Port:${colors.reset}     ${colors.cyan}${conn.connection.port}${colors.reset}`);
    console.log('');

  } catch (error) {
    console.log('');
    console.log(`${colors.red}✗${colors.reset}  ${colors.red}${colors.bright}MongoDB Connection Failed!${colors.reset}`);
    console.log(`   ${colors.dim}Error:${colors.reset} ${colors.red}${error.message}${colors.reset}`);
    console.log(`   ${colors.yellow}⚠${colors.reset}  ${colors.yellow}Continuing without database...${colors.reset}`);
    console.log('');
  }
};

module.exports = connectDB;
