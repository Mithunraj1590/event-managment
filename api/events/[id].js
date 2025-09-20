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
  const { id } = req.query;

  if (req.method === 'GET') {
    // Get single event
    try {
      await connectDB();
      const event = await Event.findById(id)
        .populate('organizer', 'name avatar email')
        .populate('attendees.user', 'name avatar');

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      const user = await authenticateToken(req);

      if (!event.isPublic && (!user || user._id.toString() !== event.organizer._id.toString())) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const eventWithVirtuals = {
        ...event.toObject(),
        isFull: event.currentAttendees >= event.maxAttendees,
        hasPassed: new Date() > event.date,
        isAttending: user ? event.attendees.some(
          attendee => attendee.user._id.toString() === user._id.toString()
        ) : false
      };

      res.json(eventWithVirtuals);
    } catch (error) {
      console.error('Get event error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else if (req.method === 'PUT') {
    // Update event (organizer or admin only)
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

      // Check if user is organizer or admin
      if (event.organizer.toString() !== user._id.toString() && user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }

      const {
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
        isPublic
      } = req.body;

      // Update fields
      if (title) event.title = title;
      if (description) event.description = description;
      if (date) {
        if (new Date(date) < new Date()) {
          return res.status(400).json({ message: 'Event date cannot be in the past' });
        }
        event.date = date;
      }
      if (time) event.time = time;
      if (location) event.location = location;
      if (category) event.category = category;
      if (maxAttendees !== undefined) {
        if (maxAttendees < event.currentAttendees) {
          return res.status(400).json({ message: 'Max attendees cannot be less than current attendees' });
        }
        event.maxAttendees = maxAttendees;
      }
      if (price !== undefined) event.price = price;
      if (image !== undefined) event.image = image;
      if (requirements) event.requirements = requirements;
      if (tags) event.tags = tags;
      if (isPublic !== undefined) event.isPublic = isPublic;

      await event.save();
      await event.populate('organizer', 'name avatar');

      res.json(event);
    } catch (error) {
      console.error('Update event error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else if (req.method === 'DELETE') {
    // Delete event (organizer or admin only)
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

      // Check if user is organizer or admin
      if (event.organizer.toString() !== user._id.toString() && user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }

      await Event.findByIdAndDelete(id);

      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Delete event error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
