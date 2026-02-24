# 🚨 URGENT FIX: API URL Issue

## Problem
Frontend is calling `https://smart-tiffin-six.vercel.app/api/...` instead of backend server.

## Root Cause
`VITE_API_URL` environment variable not set on Vercel.

## Quick Fix Steps:

### 1. Go to Vercel Dashboard
- Open https://vercel.com/dashboard
- Find your project "smart-tiffin-six"
- Go to Settings → Environment Variables

### 2. Add Environment Variable
```
Name: VITE_API_URL
Value: https://your-backend-url.onrender.com
```

### 3. Redeploy
- Go to Deployments tab
- Click "Redeploy" on latest deployment

## Alternative: Check Backend URL
If you don't have backend deployed yet:

1. **Deploy Backend First:**
   - Go to https://render.com
   - Create Web Service
   - Connect GitHub repo
   - Root directory: `backend`
   - Build: `npm install`
   - Start: `npm start`

2. **Get Backend URL:**
   - Copy the URL (e.g., `https://smart-tiffin-backend.onrender.com`)

3. **Update Vercel:**
   - Add `VITE_API_URL=https://smart-tiffin-backend.onrender.com`

## Test Fix:
After redeployment, the API calls should go to:
```
https://your-backend.onrender.com/api/auth/register
```
Instead of:
```
https://smart-tiffin-six.vercel.app/api/auth/register ❌
```