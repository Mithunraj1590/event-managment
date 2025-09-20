#!/bin/bash

echo "🚀 Starting deployment process..."

# Build the frontend
echo "📦 Building frontend..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful!"
else
    echo "❌ Frontend build failed!"
    exit 1
fi

echo "🎉 Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub"
echo "2. Deploy frontend to Vercel: https://vercel.com"
echo "3. Deploy backend to Railway: https://railway.app"
echo "4. Set environment variables in both platforms"
echo ""
echo "See DEPLOYMENT.md for detailed instructions."
