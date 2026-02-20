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
- [Documentation](#documentation)

## ✨ Features

### For Customers
- Browse and subscribe to meal plans
- Real-time order tracking
- Subscription management (pause, resume, cancel)
- Feedback and ratings
- Wallet and payment management

### For Providers
- Kitchen Dashboard System (KDS)
- Order management and tracking
- Menu and subscription plan management
- Customer feedback monitoring
- Wallet and earnings tracking
- Real-time notifications

### For Admins
- Comprehensive analytics and reports
- User and provider management
- Order monitoring and oversight
- Financial tracking
- System-wide notifications

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Axios
- Socket.io Client
- Recharts (Analytics)
- SweetAlert2

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.io
- JWT Authentication
- Razorpay Integration
- Node-cron (Scheduled Jobs)

## 📁 Project Structure

```
SmartTiffin-System/
├── backend/
│   ├── config/          # Database and configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Authentication & validation
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   ├── .env             # Environment variables
│   ├── .env.example     # Environment template
│   ├── package.json
│   └── server.js        # Entry point
│
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   ├── utils/       # Helper functions
│   │   └── App.jsx      # Main app component
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── documentation/       # API docs and guides
├── README.md
└── .gitignore
```

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

## 🔐 Environment Variables

### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/smarttiffin

# Security
JWT_SECRET=your_jwt_secret_key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Payment Gateway (Optional)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Business Constants
MASTER_UTR=STB999888777
PLATFORM_FEE_PERCENT=10
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## 🏃 Running the Application

### Development Mode

**Start Backend:**
```bash
cd backend
npm start
```
Backend runs on: `http://localhost:5000`

**Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

### Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 🌐 Deployment

### Backend (Render/Railway)
1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables from `.env.example`

### Frontend (Vercel/Netlify)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL=<backend-url>`

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Whitelist IP addresses
3. Create database user
4. Update `MONGO_URI` in backend `.env`

**Detailed deployment guide:** See `DEPLOYMENT_GUIDE.md`

## 📚 Documentation

- **Admin API Documentation:** `documentation/ADMIN_BACKEND_API.md`
- **Admin Guide:** `documentation/Admin_Documentation.md`
- **Provider Guide:** `documentation/PROVIDER_GUIDE.md`
- **Order Flow:** `documentation/Super_Admin_Order_Flow.md`
- **Deployment Guide:** `DEPLOYMENT_GUIDE.md`
- **Deployment Checklist:** `DEPLOYMENT_CHECKLIST.md`

## 🔑 Default Credentials

**Admin:**
- Email: admin@smarttiffin.com
- Password: admin123

**Provider:**
- Email: provider@example.com
- Password: provider123

**Customer:**
- Email: customer@example.com
- Password: customer123

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Support

For support and queries:
- Create an issue in the repository
- Contact: support@smarttiffin.com

---

**Made with ❤️ for Smart Tiffin System**
