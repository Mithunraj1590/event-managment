import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['conference', 'workshop', 'meetup', 'seminar', 'networking', 'other']
  },
  maxAttendees: {
    type: Number,
    required: true,
    min: 1
  },
  currentAttendees: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  image: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  requirements: [{
    type: String
  }],
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for checking if event is full
eventSchema.virtual('isFull').get(function() {
  return this.currentAttendees >= this.maxAttendees;
});

// Virtual for checking if event has passed
eventSchema.virtual('hasPassed').get(function() {
  return new Date() > this.date;
});

// Method to add attendee
eventSchema.methods.addAttendee = function(userId) {
  if (this.isFull) {
    throw new Error('Event is full');
  }
  
  if (this.hasPassed) {
    throw new Error('Event has already passed');
  }
  
  // Check if user is already attending
  const existingAttendee = this.attendees.find(
    attendee => attendee.user.toString() === userId.toString()
  );
  
  if (existingAttendee) {
    throw new Error('User is already attending this event');
  }
  
  this.attendees.push({ user: userId });
  this.currentAttendees += 1;
  
  return this.save();
};

// Method to remove attendee
eventSchema.methods.removeAttendee = function(userId) {
  const attendeeIndex = this.attendees.findIndex(
    attendee => attendee.user.toString() === userId.toString()
  );
  
  if (attendeeIndex === -1) {
    throw new Error('User is not attending this event');
  }
  
  this.attendees.splice(attendeeIndex, 1);
  this.currentAttendees -= 1;
  
  return this.save();
};

// Index for better query performance
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ organizer: 1 });

export default mongoose.model('Event', eventSchema);
