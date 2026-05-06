const ActivityLog = require('../models/ActivityLog');

const getAllActivityLogs = async (req, res, next) => {
  try {
    const logs = await ActivityLog.find()
      .populate('user', 'name email department')
      .sort({ createdAt: -1 })
      .limit(100); 
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllActivityLogs
};
