#!/bin/bash

echo "🚂 Railway Backend Deployment Script"
echo "====================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check if user is logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway:"
    railway login
fi

echo "📦 Preparing for deployment..."

# Initialize Railway project if not already done
if [ ! -f ".railway/project.json" ]; then
    echo "🚀 Initializing Railway project..."
    railway init
fi

echo "🚀 Deploying to Railway..."
railway up

echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Go to your Railway dashboard"
echo "2. Add environment variables (see RAILWAY_DEPLOYMENT.md)"
echo "3. Get your backend URL"
echo "4. Update Vercel environment variables"
echo ""
echo "📖 For detailed instructions, see RAILWAY_DEPLOYMENT.md"
