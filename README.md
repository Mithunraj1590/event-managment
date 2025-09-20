# Event Management System

A full-stack MERN application for event management with user authentication, event creation, and admin functionality.

## Features

### Authentication
- User registration and login
- Google OAuth integration
- Email verification system
- Password reset functionality
- JWT-based authentication

### Event Management
- Create, view, edit, and delete events
- Join and leave events
- Event categories and filtering
- Attendee management
- Event search functionality

### User Features
- User profiles with avatar support
- View created and joined events
- Event organizer capabilities
- Admin dashboard for system management

### Admin Features
- User management
- Event oversight
- System statistics
- Role-based access control

## Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Context** - State management

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Passport.js** - Authentication
- **JWT** - Token-based auth
- **Nodemailer** - Email service

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Gmail account (for email verification)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd event-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/event-management
   
   # Server
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   
   # Session
   SESSION_SECRET=your-super-secret-session-key
   
   # JWT
   JWT_SECRET=your-jwt-secret-key
   
   # Google OAuth (Get from Google Cloud Console)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # Email Configuration (Gmail)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=your-email@gmail.com
   ```

4. **Set up Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
   - Copy Client ID and Client Secret to `.env`

5. **Set up Gmail for email verification**
   - Enable 2-factor authentication on your Gmail account
   - Generate an App Password
   - Use the App Password in `EMAIL_PASS` (not your regular password)

6. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env with your Atlas connection string
   ```

## Running the Application

### Development Mode (Full Stack)
```bash
npm run dev:full
```
This starts both the backend server (port 5000) and frontend (port 3000).

### Backend Only
```bash
npm run server:dev
```

### Frontend Only
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/join` - Join event
- `POST /api/events/:id/leave` - Leave event
- `GET /api/events/user/my-events` - Get user's events

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/change-password` - Change password

### Admin
- `GET /api/users` - Get all users (admin)
- `GET /api/users/admin/stats` - Get user statistics
- `GET /api/events/admin/all` - Get all events (admin)

## Project Structure

```
event-management/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── auth/              # Authentication pages
│   │   ├── events/            # Event pages
│   │   ├── admin/             # Admin pages
│   │   └── profile/           # User profile
│   ├── components/            # React components
│   │   └── ui/               # shadcn/ui components
│   ├── contexts/             # React contexts
│   └── lib/                  # Utilities and API client
├── models/                   # MongoDB models
├── routes/                   # Express routes
├── middleware/               # Express middleware
├── config/                   # Configuration files
├── utils/                    # Utility functions
└── server.js                # Express server
```

## Usage

1. **Register an account** or **sign in with Google**
2. **Verify your email** (check your inbox)
3. **Create events** or **browse existing events**
4. **Join events** you're interested in
5. **Manage your profile** and view your events

### Admin Features
- First registered user automatically becomes admin
- Access admin dashboard at `/admin`
- Manage users and events
- View system statistics

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret for JWT tokens | Yes |
| `SESSION_SECRET` | Secret for sessions | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `EMAIL_USER` | Gmail address for sending emails | Yes |
| `EMAIL_PASS` | Gmail app password | Yes |
| `CLIENT_URL` | Frontend URL | Yes |
| `PORT` | Server port | No (default: 5000) |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email your-email@example.com or create an issue in the repository.