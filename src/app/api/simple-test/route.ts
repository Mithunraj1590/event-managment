// Very simple test endpoint to verify API routing is working
export async function GET() {
  console.log('Simple test endpoint called');
  
  return Response.json({
    message: 'Simple test endpoint is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
}
