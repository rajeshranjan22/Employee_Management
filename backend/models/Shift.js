const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  startTime: {
    type: String, // HH:mm
    required: true
  },
  endTime: {
    type: String, // HH:mm
    required: true
  },
  gracePeriod: {
    type: Number, // in minutes
    default: 15
  },
  workDays: {
    type: [String],
    default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Shift', shiftSchema);
