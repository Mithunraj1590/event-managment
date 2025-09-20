// Login API route for Next.js 15 App Router
import jwt from 'jsonwebtoken';
import connectDB from '../../../../../../lib/mongodb.js';
import User from '../../../../../../models/User.js';

export async function POST(request: Request) {
  // Set CORS headers
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ message: 'Email and password are required' }, { status: 400, headers });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ message: 'Invalid credentials' }, { status: 401, headers });
    }

    // Check password (only for non-Google users)
    if (user.password && !(await user.comparePassword(password))) {
      return Response.json({ message: 'Invalid credentials' }, { status: 401, headers });
    }

    // Check email verification
    if (!user.isEmailVerified) {
      return Response.json({ 
        message: 'Please verify your email before logging in',
        emailVerified: false 
      }, { status: 403, headers });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return Response.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    }, { headers });
  } catch (error: any) {
    console.error('Login error:', error);
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
