# 🚨 URGENT: CORS Error Fix

## Problem
```
Access-Control-Allow-Origin header has a value 'https://your-frontend-url.onrender.com'
```

Backend me placeholder URL hai, actual Vercel URL nahi!

## Solution (2 Minutes)

### Step 1: Render Dashboard
1. Go to: https://dashboard.render.com
2. Open your backend service: `smart-tiffin-system`
3. Click **Environment** tab

### Step 2: Update FRONTEND_URL
Find: `FRONTEND_URL`
Change from: `https://your-frontend-url.onrender.com`
Change to: `https://smart-tiffin-system-4.vercel.app`

### Step 3: Save & Redeploy
1. Click **Save Changes**
2. Service will auto-redeploy (wait 2-3 minutes)

## Verify Fix
1. Open: https://smart-tiffin-system-4.vercel.app
2. Try register
3. Check console - CORS error should be gone ✅

## Alternative: Update via Render CLI
```bash
# If you have Render CLI
render env set FRONTEND_URL=https://smart-tiffin-system-4.vercel.app
```

---

**Time Required:** 2 minutes
**Impact:** Fixes both API calls and Socket.io connection
