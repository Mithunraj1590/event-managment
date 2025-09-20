// Simple test endpoint to debug API issues for Next.js 15 App Router
export async function GET() {
  // Set CORS headers
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  try {
    console.log('Test endpoint called');
    console.log('Environment variables check:');
    console.log('- MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('- JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    
    return Response.json({
      message: 'Test endpoint working',
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasMongoUri: !!process.env.MONGODB_URI,
        hasJwtSecret: !!process.env.JWT_SECRET,
        hasSessionSecret: !!process.env.SESSION_SECRET,
        hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasEmailUser: !!process.env.EMAIL_USER
      }
    }, { headers });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return Response.json({
      message: 'Test endpoint error',
      error: error.message,
      timestamp: new Date().toISOString()
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
