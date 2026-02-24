# 🚀 Deployment Checklist

## ✅ Pre-Deployment Verification

### Code Quality
- [x] All case sensitivity issues fixed
- [x] Import paths verified (Provider folder with capital P)
- [x] Documentation consolidated into single README.md
- [x] Removed unnecessary .txt and .md files
- [ ] Run `npm install` in both frontend and backend
- [ ] Test locally before deployment

### Environment Setup
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string obtained

### Backend (Render)
- [ ] GitHub repository connected
- [ ] Root directory set to `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Environment variables configured:
  - [ ] PORT=5000
  - [ ] NODE_ENV=production
  - [ ] MONGO_URI
  - [ ] JWT_SECRET
  - [ ] FRONTEND_URL
  - [ ] RAZORPAY_KEY_ID
  - [ ] RAZORPAY_KEY_SECRET
  - [ ] MASTER_UTR=STB999888777
  - [ ] PLATFORM_FEE_PERCENT=10

### Frontend (Vercel)
- [ ] GitHub repository connected
- [ ] Framework preset: Vite
- [ ] Root directory set to `frontend`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variable configured:
  - [ ] VITE_API_URL (backend URL from Render)

## 🔧 Post-Deployment

### Testing
- [ ] Backend health check: `https://your-backend.onrender.com/api/health`
- [ ] Frontend loads successfully
- [ ] Login functionality works
- [ ] API calls successful (check browser console)
- [ ] Socket.io connection established

### Admin Setup
- [ ] Create admin user (use default credentials or create new)
- [ ] Test admin login
- [ ] Verify admin dashboard loads

### Security
- [ ] Change default admin password
- [ ] Update JWT_SECRET to strong random string
- [ ] Verify CORS settings
- [ ] Check environment variables are not exposed

## 📝 Important URLs

### Development
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- MongoDB: mongodb://localhost:27017/smarttiffin

### Production (Update after deployment)
- Frontend: https://your-app.vercel.app
- Backend: https://your-app.onrender.com
- MongoDB: mongodb+srv://...

## 🐛 Common Issues & Solutions

### Issue: CORS Error
**Solution:** Ensure FRONTEND_URL in backend .env matches your Vercel domain exactly

### Issue: MongoDB Connection Failed
**Solution:** 
- Check MONGO_URI format
- Verify network access in MongoDB Atlas
- Ensure password doesn't contain special characters (or URL encode them)

### Issue: Build Failed on Vercel
**Solution:**
- Check Node.js version compatibility
- Verify all dependencies in package.json
- Check build logs for specific errors

### Issue: API Calls Return 404
**Solution:**
- Verify VITE_API_URL in frontend .env
- Check backend is deployed and running
- Ensure API routes are correct

### Issue: JWT Token Invalid
**Solution:**
- Clear browser localStorage
- Ensure JWT_SECRET is same across deployments
- Check token expiration time

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check Render/Vercel deployment logs
3. Verify all environment variables
4. Test API endpoints using Postman/Thunder Client

---

**Last Updated:** [Current Date]
**Status:** Ready for Deployment ✅
