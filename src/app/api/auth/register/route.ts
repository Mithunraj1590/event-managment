// Register API route for Next.js 15 App Router
import jwt from 'jsonwebtoken';
import connectDB from '../../../../../../lib/mongodb.js';
import User from '../../../../../../models/User.js';
import { sendVerificationEmail } from '../../../../../../utils/emailService.js';

export async function POST(request: Request) {
  // Set CORS headers
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  try {
    await connectDB();
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return Response.json({ message: 'All fields are required' }, { status: 400, headers });
    }

    if (password.length < 6) {
      return Response.json({ message: 'Password must be at least 6 characters' }, { status: 400, headers });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ message: 'User already exists with this email' }, { status: 400, headers });
    }

    // Create user
    const user = new User({ name, email, password });
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken, name);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail registration if email fails
    }

    return Response.json({ 
      message: 'User created successfully. Please check your email for verification.',
      userId: user._id 
    }, { status: 201, headers });
  } catch (error: any) {
    console.error('Registration error:', error);
    return Response.json({ message: 'Server error' }, { status: 500, headers });
  }
}

export async function OPTIONS() {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return new Response(null, { status: 200, headers });
}
