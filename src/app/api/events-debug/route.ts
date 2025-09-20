// Debug events endpoint to isolate the issue
export async function GET() {
  console.log('Debug events endpoint called');
  
  try {
    console.log('Step 1: Importing connectDB...');
    const { default: connectDB } = await import('../../../../../lib/mongodb.js');
    console.log('Step 1: connectDB imported successfully');
    
    console.log('Step 2: Attempting database connection...');
    await connectDB();
    console.log('Step 2: Database connected successfully');
    
    console.log('Step 3: Importing Event model...');
    const { default: Event } = await import('../../../../../models/Event.js');
    console.log('Step 3: Event model imported successfully');
    
    console.log('Step 4: Attempting to find events...');
    const events = await Event.find({ isPublic: true }).limit(5).lean();
    console.log('Step 4: Events found:', events.length);
    
    return Response.json({
      message: 'Debug events endpoint working',
      events: events,
      eventCount: events.length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Debug events error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return Response.json({
      message: 'Debug events error',
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
