// Test models import endpoint
export async function GET() {
  console.log('Test models endpoint called');
  
  try {
    console.log('Attempting to import models...');
    
    // Try to import models
    const Event = await import('../../../../models/Event.js');
    const User = await import('../../../../models/User.js');
    const connectDB = await import('../../../../lib/mongodb.js');
    
    console.log('Models imported successfully');
    console.log('Event model:', Event.default);
    console.log('User model:', User.default);
    console.log('connectDB function:', connectDB.default);
    
    return Response.json({
      message: 'Models imported successfully',
      hasEventModel: !!Event.default,
      hasUserModel: !!User.default,
      hasConnectDB: !!connectDB.default,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Models import error:', error);
    return Response.json({
      message: 'Models import failed',
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
