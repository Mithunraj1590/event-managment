// Simple events test endpoint
export async function GET() {
  console.log('Simple events endpoint called');
  
  try {
    return Response.json({
      message: 'Simple events endpoint working',
      events: [],
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Simple events error:', error);
    return Response.json({
      message: 'Simple events error',
      error: error.message
    }, { status: 500 });
  }
}
