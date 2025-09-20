import Event from '../../models/Event.js';
import jwt from 'jsonwebtoken';
import connectDB from '../../lib/mongodb.js';
import User from '../../models/User.js';

async function authenticateToken(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findById(decoded.userId);
  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Get all events (public)
    try {
      await connectDB();
      const { 
        page = 1, 
        limit = 10, 
        category, 
        status = 'upcoming',
        search,
        sortBy = 'date',
        sortOrder = 'asc'
      } = req.query;

      const query = { isPublic: true };
      
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

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const events = await Event.find(query)
        .populate('organizer', 'name avatar')
        .sort(sortOptions)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

      const user = await authenticateToken(req);

      // Add virtual fields
      const eventsWithVirtuals = events.map(event => ({
        ...event,
        isFull: event.currentAttendees >= event.maxAttendees,
        hasPassed: new Date() > new Date(event.date),
        isAttending: user ? event.attendees.some(
          attendee => attendee.user.toString() === user._id.toString()
        ) : false
      }));

      const total = await Event.countDocuments(query);

      res.json({
        events: eventsWithVirtuals,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      });
    } catch (error) {
      console.error('Get events error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else if (req.method === 'POST') {
    // Create event (authenticated users only)
    try {
      await connectDB();
      const user = await authenticateToken(req);
      if (!user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

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
      } = req.body;

      // Validation
      if (!title || !description || !date || !time || !location || !category || !maxAttendees) {
        return res.status(400).json({ message: 'All required fields must be provided' });
      }

      if (new Date(date) < new Date()) {
        return res.status(400).json({ message: 'Event date cannot be in the past' });
      }

      if (maxAttendees < 1) {
        return res.status(400).json({ message: 'Maximum attendees must be at least 1' });
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

      res.status(201).json(event);
    } catch (error) {
      console.error('Create event error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
