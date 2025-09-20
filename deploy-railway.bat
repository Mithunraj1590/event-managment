@echo off
echo 🚂 Railway Backend Deployment Script
echo =====================================

REM Check if Railway CLI is installed
railway --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Railway CLI not found. Installing...
    npm install -g @railway/cli
)

REM Check if user is logged in
railway whoami >nul 2>&1
if errorlevel 1 (
    echo 🔐 Please login to Railway:
    railway login
)

echo 📦 Preparing for deployment...

REM Initialize Railway project if not already done
if not exist ".railway\project.json" (
    echo 🚀 Initializing Railway project...
    railway init
)

echo 🚀 Deploying to Railway...
railway up

echo ✅ Deployment complete!
echo.
echo Next steps:
echo 1. Go to your Railway dashboard
echo 2. Add environment variables (see RAILWAY_DEPLOYMENT.md)
echo 3. Get your backend URL
echo 4. Update Vercel environment variables
echo.
echo 📖 For detailed instructions, see RAILWAY_DEPLOYMENT.md
pause
