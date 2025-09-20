# 🚀 Complete Vercel Deployment Guide

## ✅ **Your Project is Now Ready for Single Vercel Deployment!**

Your event management app has been successfully converted to deploy everything on Vercel (both frontend and backend).

---

## 📁 **What Was Changed**

### ✅ **1. Vercel Configuration Updated**
- `vercel.json` now supports both Next.js frontend and Node.js API routes
- Environment variables configured for Vercel

### ✅ **2. API Routes Created**
- `api/health.js` - Health check endpoint
- `api/auth/register.js` - User registration
- `api/auth/login.js` - User login
- `api/auth/me.js` - Get current user
- `api/events/index.js` - Get all events & create event
- `api/events/[id].js` - Get/update/delete single event
- `api/events/join/[id].js` - Join event
- `api/events/my-events.js` - Get user's events

### ✅ **3. Database Connection**
- `lib/mongodb.js` - Optimized MongoDB connection for Vercel
- All API routes now use proper database connections

### ✅ **4. Frontend Updated**
- `src/lib/api.ts` - Updated to work with new API structure
- Removed dependency on external backend URL

---

## 🚀 **Deployment Steps**

### **Step 1: Set Up Environment Variables**

#### **Method 1: Using Vercel Dashboard (Recommended)**

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable with these exact names:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/event-management` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | `your-super-secret-jwt-key-here-make-it-long-and-random` | Random string for JWT signing |
| `SESSION_SECRET` | `your-super-secret-session-key-here-make-it-long-and-random` | Random string for sessions |
| `GOOGLE_CLIENT_ID` | `your-google-client-id` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | `your-google-client-secret` | From Google Cloud Console |
| `EMAIL_USER` | `your-gmail-email@gmail.com` | Your Gmail address |
| `EMAIL_PASS` | `your-gmail-app-password` | Gmail App Password (not regular password) |
| `EMAIL_FROM` | `your-gmail-email@gmail.com` | Same as EMAIL_USER |

**Important**: Make sure to set these for **Production**, **Preview**, and **Development** environments.

#### **Method 2: Using Vercel CLI**

Run the setup script to get the values:
```bash
.\setup-vercel-env.bat
```

Then add them using Vercel CLI:
```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add SESSION_SECRET
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add EMAIL_USER
vercel env add EMAIL_PASS
vercel env add EMAIL_FROM
```

### **Step 2: Deploy to Vercel**

#### **Option A: Using Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: your-event-app
# - Directory: ./
# - Override settings? No
```

#### **Option B: Using Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"New Project"**
4. Import your repository
5. Vercel will auto-detect Next.js
6. Add environment variables in Settings → Environment Variables

### **Step 3: Update Google OAuth**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Update OAuth redirect URIs:
   ```
   https://your-app-name.vercel.app/api/auth/google/callback
   ```

### **Step 4: Test Your Deployment**

1. **Health Check**: `https://your-app-name.vercel.app/api/health`
2. **Frontend**: `https://your-app-name.vercel.app`
3. **Test Registration/Login**
4. **Test Event Creation**

---

## 🔧 **Local Development**

To run locally:
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Your app will be available at `http://localhost:3000`

---

## 📊 **Database Setup**

### **MongoDB Atlas (Free)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create cluster (M0 - Free)
4. Create database user
5. Get connection string
6. Add to Vercel environment variables

### **Network Access**
- Allow all IPs: `0.0.0.0/0` (for Vercel deployment)

---

## 🔐 **Google OAuth Setup**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (development)
   - `https://your-app-name.vercel.app/api/auth/google/callback` (production)

---

## 📧 **Email Setup (Gmail)**

1. Enable 2-factor authentication on Gmail
2. Generate App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use App Password in `EMAIL_PASS` environment variable

---

## 🎯 **API Endpoints**

Your app now has these API endpoints:

### **Authentication**
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### **Events**
- `GET /api/events` - Get all events
- `POST /api/events` - Create event
- `GET /api/events/[id]` - Get single event
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event
- `POST /api/events/join/[id]` - Join event
- `GET /api/events/my-events` - Get user's events

### **Health**
- `GET /api/health` - Health check

---

## 🚨 **Troubleshooting**

### **"MongoDB URL Reference Secret Do Not Exist" Error**

This error occurs when Vercel can't find the environment variables. Here's how to fix it:

1. **Check Environment Variables in Vercel Dashboard**:
   - Go to your Vercel project dashboard
   - Navigate to **Settings** → **Environment Variables**
   - Ensure all required variables are present:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `SESSION_SECRET`
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
     - `EMAIL_USER`
     - `EMAIL_PASS`
     - `EMAIL_FROM`

2. **Verify Variable Names**:
   - Variable names must match exactly (case-sensitive)
   - No extra spaces or special characters

3. **Check Environment Scope**:
   - Make sure variables are set for **Production**, **Preview**, and **Development**
   - Click the environment checkboxes when adding variables

4. **Redeploy After Adding Variables**:
   - After adding environment variables, trigger a new deployment
   - Go to **Deployments** tab and click **Redeploy**

### **Build Errors**
- Check that all dependencies are in `dependencies` not `devDependencies`
- Ensure MongoDB connection string is correct
- Verify all environment variables are set

### **Database Connection Issues**
- Check MongoDB Atlas network access (allow all IPs: `0.0.0.0/0`)
- Verify connection string format
- Check environment variables in Vercel dashboard
- Ensure MongoDB Atlas cluster is running

### **Authentication Issues**
- Verify JWT_SECRET is set
- Check Google OAuth redirect URIs
- Ensure email verification is working

### **Email Issues**
- Use Gmail App Password (not regular password)
- Enable 2-factor authentication first
- Check EMAIL_USER and EMAIL_PASS variables

---

## 💰 **Cost**

**Vercel Free Tier Includes:**
- ✅ Unlimited personal projects
- ✅ 100GB bandwidth per month
- ✅ Serverless functions (API routes)
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Custom domains

**MongoDB Atlas Free Tier:**
- ✅ 512MB storage
- ✅ Shared clusters
- ✅ Up to 100 connections

**Total Cost: $0/month** 🎉

---

## 🎉 **You're All Set!**

Your event management app is now ready to deploy to Vercel with:
- ✅ Full-stack deployment on one platform
- ✅ No separate backend hosting needed
- ✅ Automatic scaling
- ✅ Global CDN
- ✅ Free hosting

Deploy now and your app will be live at `https://your-app-name.vercel.app`!
