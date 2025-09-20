import Event from '../../../models/Event';
import jwt from 'jsonwebtoken';
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';

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
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    await connectDB();
    const user = await authenticateToken(req);
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.isPublic) {
      return res.status(403).json({ message: 'This is a private event' });
    }

    await event.addAttendee(user._id);

    res.json({ message: 'Successfully joined the event' });
  } catch (error) {
    if (error.message === 'Event is full' || error.message === 'Event has already passed' || error.message === 'User is already attending this event') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Join event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
