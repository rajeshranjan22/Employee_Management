const Attendance = require('../models/Attendance');
const User = require('../models/User');
const Shift = require('../models/Shift');

const clockIn = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const today = new Date().toISOString().split('T')[0];
    const { location } = req.body;

    const existing = await Attendance.findOne({ user: userId, date: today });
    if (existing) {
      return res.status(400).json({ error: 'You have already clocked in for today.' });
    }

    const user = await User.findById(userId).populate('shift');
    let status = 'Present';

    if (user.shift) {
      const now = new Date();
      const [shiftHour, shiftMin] = user.shift.startTime.split(':');
      const shiftStartTime = new Date();
      shiftStartTime.setHours(shiftHour, shiftMin, 0, 0);
      
      const graceTime = new Date(shiftStartTime.getTime() + user.shift.gracePeriod * 60000);
      
      if (now > graceTime) {
        status = 'Late';
      }
    }

    const attendance = await Attendance.create({
      user: userId,
      date: today,
      clockIn: new Date(),
      status,
      location
    });

    await User.findByIdAndUpdate(userId, { lastClockIn: new Date() });

    res.status(201).json(attendance);
  } catch (err) {
    next(err);
  }
};

const clockOut = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const today = new Date().toISOString().split('T')[0];

    const attendance = await Attendance.findOne({ user: userId, date: today });
    if (!attendance) {
      return res.status(404).json({ error: 'No clock-in record found for today.' });
    }

    if (attendance.clockOut) {
      return res.status(400).json({ error: 'You have already clocked out for today.' });
    }

    attendance.clockOut = new Date();
    
    const diffMs = attendance.clockOut - attendance.clockIn;
    const breakMs = (attendance.breaks || []).reduce((total, b) => {
      if (b.startTime && b.endTime) {
        return total + (b.endTime - b.startTime);
      }
      return total;
    }, 0);
    
    attendance.workHours = Math.round((diffMs - breakMs) / 60000);

    const user = await User.findById(userId).populate('shift');
    if (user.shift) {
        const [startH, startM] = user.shift.startTime.split(':');
        const [endH, endM] = user.shift.endTime.split(':');
        const shiftDurationMin = (parseInt(endH) * 60 + parseInt(endM)) - (parseInt(startH) * 60 + parseInt(startM));
        if (attendance.workHours > shiftDurationMin) {
            attendance.overtime = attendance.workHours - shiftDurationMin;
        }
    }

    await attendance.save();
    res.json(attendance);
  } catch (err) {
    next(err);
  }
};

const getTodayStatus = async (req, res, next) => {
    try {
        const userId = req.user.id || req.user._id;
        const today = new Date().toISOString().split('T')[0];
        const attendance = await Attendance.findOne({ user: userId, date: today });
        res.json(attendance || { message: 'Not clocked in today' });
    } catch (err) {
        next(err);
    }
}

const getLogs = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const { startDate, endDate } = req.query;
    
    const filter = { user: userId };
    if (startDate && endDate) {
        filter.date = { $gte: startDate, $lte: endDate };
    }

    const logs = await Attendance.find(filter).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

const getAllLogs = async (req, res, next) => {
  try {
    const { startDate, endDate, department } = req.query;
    
    const filter = {};
    if (startDate && endDate) {
        filter.date = { $gte: startDate, $lte: endDate };
    }

    let logs = await Attendance.find(filter)
        .populate('user', 'name email department')
        .sort({ date: -1 });

    if (department && department !== 'All') {
        logs = logs.filter(log => log.user && log.user.department === department);
    }

    res.json(logs);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  clockIn,
  clockOut,
  getTodayStatus,
  getLogs,
  getAllLogs
};
