# 🍱 Smart Tiffin System

A comprehensive MERN stack application for managing tiffin (meal subscription) services with real-time order tracking, subscription management, and multi-role dashboards.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Default Credentials](#default-credentials)

---

## ✨ Features

### For Customers
- Browse and subscribe to meal plans
- Real-time order tracking with live map
- Subscription management (pause, resume, cancel)
- Feedback and ratings system
- Wallet and payment management
- Guest meal requests
- Order history and analytics

### For Providers
- Kitchen Dashboard System (KDS)
- Order management and tracking
- Menu and subscription plan management
- Customer feedback monitoring
- Wallet and earnings tracking
- Real-time notifications
- Revenue analytics
- Active customer management

### For Admins
- Comprehensive analytics and reports
- User and provider management
- Order monitoring and oversight
- Financial tracking and payouts
- System-wide notifications
- Menu approval workflow
- Support ticket management
- Platform settings configuration

---

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Axios
- Socket.io Client
- Recharts (Analytics)
- React Router v6
- SweetAlert2

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.io
- JWT Authentication
- Razorpay Integration
- Node-cron (Scheduled Jobs)
- Bcrypt for password hashing

---

## 📁 Project Structure

```
SmartTiffin-System/
├── backend/
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── constants.js             # App constants
│   ├── controllers/
│   │   ├── admin/                   # Admin controllers
│   │   ├── customer/                # Customer controllers
│   │   ├── provider/                # Provider controllers
│   │   ├── authcontroller.js        # Authentication
│   │   └── bankController.js        # Bank operations
│   ├── middleware/
│   │   ├── authMiddleware.middleware.js
│   │   ├── requestLogger.middleware.js
│   │   └── validateInput.js
│   ├── models/                      # MongoDB schemas
│   ├── routes/
│   │   ├── admin/                   # Admin routes
│   │   ├── customer/                # Customer routes
│   │   ├── provider/                # Provider routes
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   └── health.routes.js
│   ├── services/
│   │   └── orderCronService.js      # Scheduled tasks
│   ├── utils/                       # Helper functions
│   ├── .env.example
│   ├── package.json
│   └── server.js                    # Entry point
│
├── frontend/
│   ├── public/
│   │   ├── assets/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/               # Admin components
│   │   │   ├── auth/                # Auth components
│   │   │   ├── common/              # Shared components
│   │   │   ├── customer/            # Customer components
│   │   │   ├── discovery/           # Mess discovery
│   │   │   ├── landing/             # Landing page
│   │   │   ├── provider/            # Provider components
│   │   │   └── ui/                  # UI components
│   │   ├── config/
│   │   │   └── api.js               # API configuration
│   │   ├── context/                 # React contexts
│   │   ├── hooks/                   # Custom hooks
│   │   ├── layouts/                 # Layout components
│   │   ├── pages/
│   │   │   ├── admin/               # Admin pages
│   │   │   ├── auth/                # Auth pages
│   │   │   ├── customer/            # Customer pages
│   │   │   ├── discovery/           # Discovery pages
│   │   │   ├── Provider/            # Provider pages (Capital P)
│   │   │   └── LandingPage.jsx
│   │   ├── routes/                  # Route configurations
│   │   ├── services/                # API services
│   │   ├── utils/                   # Utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Clone Repository
```bash
git clone <repository-url>
cd SmartTiffin-System
```

### Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

---

## 🔐 Environment Variables

### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGO_URI=mongodb://localhost:27017/smarttiffin
# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/smarttiffin

# Security
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
# For production:
# FRONTEND_URL=https://your-frontend-domain.vercel.app

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Business Constants
MASTER_UTR=STB999888777
PLATFORM_FEE_PERCENT=10
```

### Frontend (.env)
```env
# API Base URL
VITE_API_URL=http://localhost:5000
# For production:
# VITE_API_URL=https://your-backend-domain.render.com
```

---

## 🏃 Running the Application

### Development Mode

**1. Start Backend:**
```bash
cd backend
npm start
```
Backend runs on: `http://localhost:5000`

**2. Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

### Production Build

**Backend:**
```bash
cd backend
npm install
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run build
npm run preview
```

---

## 🌐 Deployment

### Backend Deployment (Render)

1. **Create Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node

3. **Add Environment Variables**
   ```
   PORT=5000
   NODE_ENV=production
   MONGO_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<your-secret-key>
   FRONTEND_URL=<your-vercel-frontend-url>
   RAZORPAY_KEY_ID=<your-key>
   RAZORPAY_KEY_SECRET=<your-secret>
   MASTER_UTR=STB999888777
   PLATFORM_FEE_PERCENT=10
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the backend URL (e.g., `https://your-app.onrender.com`)

### Frontend Deployment (Vercel)

1. **Deploy to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository

2. **Configure Project**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

3. **Add Environment Variable**
   ```
   VITE_API_URL=<your-render-backend-url>
   ```
   Example: `VITE_API_URL=https://your-app.onrender.com`

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

### Database Setup (MongoDB Atlas)

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Choose your preferred region

2. **Configure Access**
   - **Network Access:** Add IP `0.0.0.0/0` (allow from anywhere)
   - **Database Access:** Create database user with password

3. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Update `MONGO_URI` in backend environment variables

### Post-Deployment Steps

1. **Update CORS Settings**
   - Ensure `FRONTEND_URL` in backend matches your Vercel domain

2. **Test API Connection**
   - Visit `https://your-backend.onrender.com/api/health`
   - Should return: `{"status": "OK"}`

3. **Create Admin User**
   - Run the admin creation script or use the default credentials

---

## 📚 API Documentation

### Base URLs
- **Development:** `http://localhost:5000/api`
- **Production:** `https://your-backend.onrender.com/api`

### Authentication
All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

### Main API Endpoints

#### Auth Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token

#### Customer Routes (`/api/customer`)
- `GET /dashboard` - Customer dashboard stats
- `GET /menu` - View available menus
- `POST /subscription` - Create subscription
- `GET /orders` - Order history
- `POST /feedback` - Submit feedback
- `GET /wallet` - Wallet balance and transactions

#### Provider Routes (`/api/provider`)
- `GET /dashboard` - Provider dashboard stats
- `GET /orders` - Today's orders
- `POST /menu` - Create/update menu
- `GET /customers` - Active customers list
- `GET /revenue` - Revenue analytics
- `POST /plan` - Create subscription plan

#### Admin Routes (`/api/admin`)
- `GET /stats` - Platform statistics
- `GET /customers` - All customers
- `GET /providers` - All providers
- `GET /orders` - All orders
- `PUT /providers/:id/verify` - Verify provider
- `GET /finance/stats` - Financial overview
- `POST /broadcast` - Send system notification

### Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error info"
}
```

---

## 👥 User Roles

### Customer
**Purpose:** End user who subscribes to meal plans

**Capabilities:**
- Browse available mess/tiffin services
- Subscribe to meal plans
- Track orders in real-time
- Manage subscriptions (pause/resume/cancel)
- Provide feedback and ratings
- Manage wallet and payments
- View order history

**Restrictions:**
- Cannot access provider or admin features
- Cannot modify menu or plans
- Cannot view other customers' data

### Provider
**Purpose:** Mess/kitchen owner who prepares meals

**Capabilities:**
- View daily orders and quantities
- Update order preparation status
- Manage weekly menu
- Create subscription plans
- View active customers
- Track revenue and earnings
- Respond to customer feedback

**Restrictions:**
- Cannot modify customer data
- Cannot access payment processing
- Cannot change platform settings
- Works under admin supervision

### Admin
**Purpose:** Platform administrator with full control

**Capabilities:**
- Manage all users (customers & providers)
- Verify and approve providers
- Monitor all orders and transactions
- Process payouts to providers
- Configure platform settings
- Send system-wide notifications
- Generate reports and analytics
- Handle support tickets

**Restrictions:**
- None - full system access

---

## 🔑 Default Credentials

### Admin
```
Email: admin@smarttiffin.com
Password: admin123
```

### Provider (Demo)
```
Email: provider@example.com
Password: provider123
```

### Customer (Demo)
```
Email: customer@example.com
Password: customer123
```

**⚠️ Important:** Change these credentials in production!

---

## 🔧 Key Features Explained

### Real-Time Order Tracking
- Socket.io integration for live updates
- Order status: Placed → Accepted → Preparing → Ready → Out for Delivery → Delivered
- Live map tracking for delivery

### Subscription Management
- Daily, weekly, monthly plans
- Pause/resume functionality
- Automatic order generation via cron jobs
- Meal customization options

### Payment System
- Razorpay integration for online payments
- Wallet system for customers
- Provider payout management
- Transaction history

### Notification System
- Real-time notifications via Socket.io
- Email notifications (optional)
- In-app notification center
- Broadcast messages from admin

---

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```
Solution: Check MONGO_URI in .env file
Ensure MongoDB is running (local) or Atlas cluster is active
```

**2. CORS Error**
```
Solution: Verify FRONTEND_URL in backend .env matches your frontend domain
Check if backend is running and accessible
```

**3. JWT Token Invalid**
```
Solution: Clear localStorage and login again
Ensure JWT_SECRET is same across deployments
```

**4. Build Fails on Vercel/Render**
```
Solution: Check Node.js version compatibility
Verify all dependencies are in package.json
Check build logs for specific errors
```

---

## 📝 Scripts

### Backend Scripts
```bash
npm start          # Start server
npm run dev        # Start with nodemon (development)
npm test           # Run tests
```

### Frontend Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Support

For support and queries:
- Create an issue in the repository
- Email: support@smarttiffin.com

---

## 🙏 Acknowledgments

- Built with MERN Stack
- UI inspired by modern food delivery apps
- Icons from Heroicons
- Deployment on Vercel & Render

---

**Made with ❤️ for Smart Tiffin System**
