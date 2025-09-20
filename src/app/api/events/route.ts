// Events API route for Next.js 15 App Router
import Event from '../../../../../models/Event.js';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../../lib/mongodb.js';
import User from '../../../../../models/User.js';

console.log('Events API route loaded');
console.log('Event model:', Event);
console.log('User model:', User);
console.log('connectDB function:', connectDB);

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
  console.log('Events API GET endpoint called');
  console.log('Request URL:', request.url);
  console.log('Request method:', request.method);
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  
  // Set CORS headers
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  try {
    console.log('Attempting to connect to database...');
    await connectDB();
    console.log('Database connected successfully');
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'upcoming';
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    console.log('Query parameters:', { page, limit, category, status, search, sortBy, sortOrder });

    const query: any = { isPublic: true };
    
    if (category) {
      query.category = category;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    console.log('Executing Event.find query...');
    const events = await Event.find(query)
      .populate('organizer', 'name avatar')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    console.log(`Found ${events.length} events`);
    const user = await authenticateToken(request);

    // Add virtual fields
    const eventsWithVirtuals = events.map(event => ({
      ...event,
      isFull: event.currentAttendees >= event.maxAttendees,
      hasPassed: new Date() > new Date(event.date),
      isAttending: user ? event.attendees.some(
        (attendee: any) => attendee.user.toString() === user._id.toString()
      ) : false
    }));

    const total = await Event.countDocuments(query);
    console.log(`Total events: ${total}`);

    const response = {
      events: eventsWithVirtuals,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    };

    console.log('Sending response:', { eventCount: eventsWithVirtuals.length, totalPages: response.totalPages });
    return Response.json(response, { headers });
  } catch (error: any) {
    console.error('Get events error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return Response.json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500, headers });
  }
}

export async function POST(request: Request) {
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

    const body = await request.json();
    const {
      title,
      description,
      date,
      time,
      location,
      category,
      maxAttendees,
      price = 0,
      image = '',
      requirements = [],
      tags = [],
      isPublic = true
    } = body;

    // Validation
    if (!title || !description || !date || !time || !location || !category || !maxAttendees) {
      return Response.json({ message: 'All required fields must be provided' }, { status: 400, headers });
    }

    if (new Date(date) < new Date()) {
      return Response.json({ message: 'Event date cannot be in the past' }, { status: 400, headers });
    }

    if (maxAttendees < 1) {
      return Response.json({ message: 'Maximum attendees must be at least 1' }, { status: 400, headers });
    }

    const event = new Event({
      title,
      description,
      date,
      time,
      location,
      category,
      maxAttendees,
      price,
      image,
      requirements,
      tags,
      isPublic,
      organizer: user._id
    });

    await event.save();
    await event.populate('organizer', 'name avatar');

    return Response.json(event, { status: 201, headers });
  } catch (error: any) {
    console.error('Create event error:', error);
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
