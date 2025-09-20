# 🚂 Railway Backend Deployment Guide

## Step 1: Prepare Your Repository

1. **Commit all your changes:**
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

## Step 2: Deploy to Railway

### Option A: Using Railway CLI (Recommended)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```

3. **Initialize Railway project:**
   ```bash
   railway init
   ```

4. **Deploy:**
   ```bash
   railway up
   ```

### Option B: Using Railway Dashboard

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your repository
6. Railway will automatically detect it's a Node.js project

## Step 3: Configure Environment Variables

In your Railway dashboard, go to **Variables** tab and add:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event-management?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=production

# JWT & Session
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
SESSION_SECRET=your-super-secret-session-key-here-make-it-long-and-random

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Configuration
EMAIL_USER=your-gmail-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=your-gmail-email@gmail.com

# CORS (Optional - Railway will set this automatically)
CLIENT_URL=https://your-vercel-app.vercel.app
```

## Step 4: Get Your Backend URL

1. After deployment, Railway will provide you with a URL like:
   ```
   https://your-app-name-production.up.railway.app
   ```

2. **Test your backend:**
   ```bash
   curl https://your-app-name-production.up.railway.app/api/health
   ```

## Step 5: Update Frontend Environment Variables

In your Vercel dashboard, update:
```
NEXT_PUBLIC_API_URL=https://your-app-name-production.up.railway.app
```

## Step 6: Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Update your OAuth 2.0 redirect URIs:
   ```
   https://your-app-name-production.up.railway.app/api/auth/google/callback
   ```

## Step 7: Test Your Full Application

1. **Frontend:** https://your-vercel-app.vercel.app
2. **Backend Health:** https://your-app-name-production.up.railway.app/api/health
3. **Test Registration/Login**
4. **Test Event Creation**

## Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Check that `server-package.json` exists
   - Ensure all dependencies are in `dependencies` not `devDependencies`

2. **Database Connection Issues:**
   - Verify MongoDB Atlas connection string
   - Check network access in MongoDB Atlas

3. **CORS Issues:**
   - Update `CLIENT_URL` in Railway environment variables
   - Check server.js CORS configuration

4. **Email Not Working:**
   - Verify Gmail app password
   - Check email service configuration

### Railway CLI Commands:
```bash
# View logs
railway logs

# Open in browser
railway open

# Check status
railway status

# View environment variables
railway variables
```

## Production Checklist

- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] Google OAuth redirect URIs updated
- [ ] MongoDB Atlas configured
- [ ] Email service working
- [ ] CORS configured
- [ ] Health check endpoint working
- [ ] Full application tested

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Vercel Docs: https://vercel.com/docs
