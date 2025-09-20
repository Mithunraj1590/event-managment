const express = require('express');
const Event = require('../models/Event');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all events (public)
router.get('/', optionalAuth, async (req, res) => {
  try {
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

    // Add virtual fields
    const eventsWithVirtuals = events.map(event => ({
      ...event,
      isFull: event.currentAttendees >= event.maxAttendees,
      hasPassed: new Date() > new Date(event.date),
      isAttending: req.user ? event.attendees.some(
        attendee => attendee.user.toString() === req.user._id.toString()
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
});

// Get single event
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name avatar email')
      .populate('attendees.user', 'name avatar');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.isPublic && (!req.user || req.user._id.toString() !== event.organizer._id.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const eventWithVirtuals = {
      ...event.toObject(),
      isFull: event.currentAttendees >= event.maxAttendees,
      hasPassed: new Date() > event.date,
      isAttending: req.user ? event.attendees.some(
        attendee => attendee.user._id.toString() === req.user._id.toString()
      ) : false
    };

    res.json(eventWithVirtuals);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create event (authenticated users only)
router.post('/', authenticateToken, async (req, res) => {
  try {
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
      organizer: req.user._id
    });

    await event.save();
    await event.populate('organizer', 'name avatar');

    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update event (organizer or admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is organizer or admin
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
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
});

// Delete event (organizer or admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is organizer or admin
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join event
router.post('/:id/join', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.isPublic) {
      return res.status(403).json({ message: 'This is a private event' });
    }

    await event.addAttendee(req.user._id);

    res.json({ message: 'Successfully joined the event' });
  } catch (error) {
    if (error.message === 'Event is full' || error.message === 'Event has already passed' || error.message === 'User is already attending this event') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Join event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Leave event
router.post('/:id/leave', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.removeAttendee(req.user._id);

    res.json({ message: 'Successfully left the event' });
  } catch (error) {
    if (error.message === 'User is not attending this event') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Leave event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's events (created and joined)
router.get('/user/my-events', authenticateToken, async (req, res) => {
  try {
    const { type = 'all' } = req.query; // 'created', 'joined', 'all'

    let query = {};
    
    if (type === 'created') {
      query = { organizer: req.user._id };
    } else if (type === 'joined') {
      query = { 'attendees.user': req.user._id };
    } else {
      // Get both created and joined events
      query = {
        $or: [
          { organizer: req.user._id },
          { 'attendees.user': req.user._id }
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
        attendee => attendee.user.toString() === req.user._id.toString()
      ),
      isOrganizer: event.organizer._id.toString() === req.user._id.toString()
    }));

    res.json(eventsWithVirtuals);
  } catch (error) {
    console.error('Get user events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = status ? { status } : {};

    const events = await Event.find(query)
      .populate('organizer', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(query);

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Admin get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
