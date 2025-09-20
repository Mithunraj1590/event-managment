@echo off
echo 🔧 Environment Variables Setup Helper
echo =====================================

echo Please provide the following information for your production environment:
echo.

set /p MONGODB_URI="📊 MongoDB Atlas URI: "
set /p JWT_SECRET="🔐 JWT Secret (make it long and random): "
set /p SESSION_SECRET="🔑 Session Secret (make it long and random): "
set /p GOOGLE_CLIENT_ID="🔍 Google Client ID: "
set /p GOOGLE_CLIENT_SECRET="🔍 Google Client Secret: "
set /p EMAIL_USER="📧 Gmail Email: "
set /p EMAIL_PASS="📧 Gmail App Password: "
set /p CLIENT_URL="🌐 Your Vercel App URL (e.g., https://your-app.vercel.app): "

echo.
echo 📋 Environment Variables for Railway:
echo =====================================
echo MONGODB_URI=%MONGODB_URI%
echo PORT=5000
echo NODE_ENV=production
echo JWT_SECRET=%JWT_SECRET%
echo SESSION_SECRET=%SESSION_SECRET%
echo GOOGLE_CLIENT_ID=%GOOGLE_CLIENT_ID%
echo GOOGLE_CLIENT_SECRET=%GOOGLE_CLIENT_SECRET%
echo EMAIL_USER=%EMAIL_USER%
echo EMAIL_PASS=%EMAIL_PASS%
echo EMAIL_FROM=%EMAIL_USER%
echo CLIENT_URL=%CLIENT_URL%
echo.
echo 📋 Environment Variables for Vercel:
echo ====================================
echo NEXT_PUBLIC_API_URL=https://your-railway-app.up.railway.app
echo.
echo ⚠️  Remember to:
echo 1. Add these variables to your Railway dashboard
echo 2. Add the Vercel variable to your Vercel dashboard
echo 3. Update Google OAuth redirect URIs
echo 4. Test your application
pause
