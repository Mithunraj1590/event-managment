@echo off
echo 🌐 Vercel Environment Variables Setup Helper
echo ============================================

echo Please provide the following information for your Vercel deployment:
echo.

set /p MONGODB_URI="📊 MongoDB Atlas URI: "
set /p JWT_SECRET="🔐 JWT Secret (make it long and random): "
set /p SESSION_SECRET="🔑 Session Secret (make it long and random): "
set /p GOOGLE_CLIENT_ID="🔍 Google Client ID: "
set /p GOOGLE_CLIENT_SECRET="🔍 Google Client Secret: "
set /p EMAIL_USER="📧 Gmail Email: "
set /p EMAIL_PASS="📧 Gmail App Password: "

echo.
echo 📋 Environment Variables for Vercel:
echo ====================================
echo MONGODB_URI=%MONGODB_URI%
echo JWT_SECRET=%JWT_SECRET%
echo SESSION_SECRET=%SESSION_SECRET%
echo GOOGLE_CLIENT_ID=%GOOGLE_CLIENT_ID%
echo GOOGLE_CLIENT_SECRET=%GOOGLE_CLIENT_SECRET%
echo EMAIL_USER=%EMAIL_USER%
echo EMAIL_PASS=%EMAIL_PASS%
echo EMAIL_FROM=%EMAIL_USER%
echo.
echo ⚠️  Remember to:
echo 1. Add these variables to your Vercel dashboard (Settings → Environment Variables)
echo 2. Update Google OAuth redirect URIs to include your Vercel domain
echo 3. Test your application
echo.
echo 🚀 Your app will be available at: https://your-app-name.vercel.app
pause
