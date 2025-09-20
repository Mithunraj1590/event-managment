# 🚀 Deployment Guide for Event Management App

## Frontend Deployment (Vercel)

### 1. Prepare for Deployment

1. **Install Vercel CLI** (optional but recommended):
   ```bash
   npm i -g vercel
   ```

2. **Build the project locally** to test:
   ```bash
   npm run build
   ```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
vercel
```

#### Option B: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Configure environment variables (see below)

### 3. Environment Variables in Vercel

Add these environment variables in your Vercel dashboard:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

## Backend Deployment Options

### Option 1: Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub account
3. Create a new project
4. Add your backend files (server.js, models/, routes/, etc.)
5. Set environment variables:
   ```
   MONGODB_URI=your-mongodb-atlas-uri
   JWT_SECRET=your-jwt-secret
   SESSION_SECRET=your-session-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   EMAIL_USER=your-gmail-email
   EMAIL_PASS=your-gmail-app-password
   EMAIL_FROM=your-gmail-email
   ```

### Option 2: Render
1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your repository
4. Set build command: `npm install`
5. Set start command: `node server.js`

### Option 3: Heroku
1. Install Heroku CLI
2. Create Heroku app: `heroku create your-app-name`
3. Deploy: `git push heroku main`

## Project Structure for Deployment

```
event/
├── src/                    # Frontend (Next.js)
├── server.js              # Backend entry point
├── models/                # Database models
├── routes/                # API routes
├── middleware/            # Auth middleware
├── config/                # Passport config
├── utils/                 # Email service
├── package.json           # Frontend dependencies
├── server-package.json    # Backend dependencies (create this)
└── vercel.json           # Vercel config
```

## Important Notes

1. **Separate Frontend and Backend**: Deploy them separately
2. **Environment Variables**: Set them in both Vercel and your backend hosting
3. **CORS**: Make sure your backend allows requests from your Vercel domain
4. **Database**: Use MongoDB Atlas for production
5. **Email**: Use a production email service for better deliverability

## Testing Your Deployment

1. Test frontend: `https://your-app.vercel.app`
2. Test backend: `https://your-backend.railway.app/api/health`
3. Test authentication flow
4. Test event creation and management

## Troubleshooting

- **CORS Issues**: Update CORS settings in server.js
- **Environment Variables**: Double-check all variables are set
- **Build Errors**: Check build logs in Vercel dashboard
- **API Errors**: Check backend logs in Railway/Render dashboard
