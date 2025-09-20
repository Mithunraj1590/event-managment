#!/bin/bash

echo "🔧 Environment Variables Setup Helper"
echo "====================================="

echo "Please provide the following information for your production environment:"
echo ""

# MongoDB URI
read -p "📊 MongoDB Atlas URI: " MONGODB_URI

# JWT Secret
read -p "🔐 JWT Secret (make it long and random): " JWT_SECRET

# Session Secret
read -p "🔑 Session Secret (make it long and random): " SESSION_SECRET

# Google OAuth
read -p "🔍 Google Client ID: " GOOGLE_CLIENT_ID
read -p "🔍 Google Client Secret: " GOOGLE_CLIENT_SECRET

# Email Configuration
read -p "📧 Gmail Email: " EMAIL_USER
read -p "📧 Gmail App Password: " EMAIL_PASS

# Frontend URL
read -p "🌐 Your Vercel App URL (e.g., https://your-app.vercel.app): " CLIENT_URL

echo ""
echo "📋 Environment Variables for Railway:"
echo "====================================="
echo "MONGODB_URI=$MONGODB_URI"
echo "PORT=5000"
echo "NODE_ENV=production"
echo "JWT_SECRET=$JWT_SECRET"
echo "SESSION_SECRET=$SESSION_SECRET"
echo "GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID"
echo "GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET"
echo "EMAIL_USER=$EMAIL_USER"
echo "EMAIL_PASS=$EMAIL_PASS"
echo "EMAIL_FROM=$EMAIL_USER"
echo "CLIENT_URL=$CLIENT_URL"
echo ""
echo "📋 Environment Variables for Vercel:"
echo "===================================="
echo "NEXT_PUBLIC_API_URL=https://your-railway-app.up.railway.app"
echo ""
echo "⚠️  Remember to:"
echo "1. Add these variables to your Railway dashboard"
echo "2. Add the Vercel variable to your Vercel dashboard"
echo "3. Update Google OAuth redirect URIs"
echo "4. Test your application"
