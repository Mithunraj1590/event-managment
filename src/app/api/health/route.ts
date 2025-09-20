// Health check endpoint for Next.js 15 App Router
import connectDB from '../../../../lib/mongodb.js';

export async function GET() {
  // Set CORS headers
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  try {
    // Test database connection
    await connectDB();
    
    return Response.json({ 
      message: 'Server is running!',
      database: 'Connected',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }, { headers });
  } catch (error) {
    console.error('Health check failed:', error);
    return Response.json({ 
      message: 'Server is running but database connection failed',
      database: 'Disconnected',
      error: error.message,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }, { status: 500, headers });
  }
}

export async function OPTIONS() {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return new Response(null, { status: 200, headers });
}