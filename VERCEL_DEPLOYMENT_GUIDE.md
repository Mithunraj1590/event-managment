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

Run the setup script:
```bash
.\setup-vercel-env.bat
```

Or manually add these to your Vercel dashboard:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event-management
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
SESSION_SECRET=your-super-secret-session-key-here-make-it-long-and-random
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
EMAIL_USER=your-gmail-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=your-gmail-email@gmail.com
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

### **Build Errors**
- Check that all dependencies are in `dependencies` not `devDependencies`
- Ensure MongoDB connection string is correct
- Verify all environment variables are set

### **Database Connection Issues**
- Check MongoDB Atlas network access (allow all IPs)
- Verify connection string format
- Check environment variables in Vercel dashboard

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
