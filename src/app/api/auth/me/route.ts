// Get current user API route for Next.js 15 App Router
import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb.js';
import User from '../../../../models/User.js';

async function authenticateToken(request: Request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return await User.findById(decoded.userId);
  } catch (error) {
    return null;
  }
}

export async function GET(request: Request) {
  // Set CORS headers
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  try {
    await connectDB();
    const user = await authenticateToken(request);
    
    if (!user) {
      return Response.json({ message: 'Authentication required' }, { status: 401, headers });
    }

    return Response.json({
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
    console.error('Get user error:', error);
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
