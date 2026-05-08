const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // format YYYY-MM-DD
    required: true
  },
  clockIn: {
    type: Date,
    required: true
  },
  clockOut: {
    type: Date
  },
  breaks: [{
    startTime: Date,
    endTime: Date,
    reason: String
  }],
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late', 'Half-Day'],
    default: 'Present'
  },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  workHours: {
    type: Number, // total minutes
    default: 0
  },
  overtime: {
    type: Number, // total minutes
    default: 0
  }
}, {
  timestamps: true,
  versionKey: false
});

// Index for fast lookups
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
