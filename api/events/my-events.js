import Event from '../../models/Event';
import jwt from 'jsonwebtoken';
import connectDB from '../../lib/mongodb';
import User from '../../models/User';

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
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const user = await authenticateToken(req);
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { type = 'all' } = req.query; // 'created', 'joined', 'all'

    let query = {};
    
    if (type === 'created') {
      query = { organizer: user._id };
    } else if (type === 'joined') {
      query = { 'attendees.user': user._id };
    } else {
      // Get both created and joined events
      query = {
        $or: [
          { organizer: user._id },
          { 'attendees.user': user._id }
        ]
      };
    }

    const events = await Event.find(query)
      .populate('organizer', 'name avatar')
      .sort({ date: 1 })
      .lean();

    const eventsWithVirtuals = events.map(event => ({
      ...event,
      isFull: event.currentAttendees >= event.maxAttendees,
      hasPassed: new Date() > new Date(event.date),
      isAttending: event.attendees.some(
        attendee => attendee.user.toString() === user._id.toString()
      ),
      isOrganizer: event.organizer._id.toString() === user._id.toString()
    }));

    res.json(eventsWithVirtuals);
  } catch (error) {
    console.error('Get user events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
