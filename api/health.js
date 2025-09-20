// Health check endpoint
import connectDB from '../../lib/mongodb.js';

export default async function handler(req, res) {
  try {
    // Test database connection
    await connectDB();
    
    res.status(200).json({ 
      message: 'Server is running!',
      database: 'Connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      message: 'Server is running but database connection failed',
      database: 'Disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
