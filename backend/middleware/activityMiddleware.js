const ActivityLog = require('../models/ActivityLog');

const logActivity = (action) => {
  return async (req, res, next) => {
    const originalSend = res.send;

    res.send = function (body) {
      res.send = originalSend;
      res.send(body);

      if (res.statusCode >= 200 && res.statusCode < 300) {
        if (req.user) {
          try {
            let details = {};
            if (req.method === 'POST' || req.method === 'PUT') {
               const { password, ...safeBody } = req.body || {};
               details = safeBody;
            } else if (req.method === 'DELETE') {
               details = { id: req.params.id };
            }

            ActivityLog.create({
              user: req.user.id || req.user._id,
              action: action,
              details: details,
              ipAddress: req.ip,
            }).catch(err => console.error('Failed to log activity:', err));
          } catch (err) {
            console.error('Failed to log activity:', err);
          }
        }
      }
    };

    next();
  };
};

module.exports = { logActivity };
