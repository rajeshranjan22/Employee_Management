const express = require('express');
const router = express.Router();
const { clockIn, clockOut, getTodayStatus, getLogs, getAllLogs } = require('../controllers/attendanceController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/permissionMiddleware');
const { logActivity } = require('../middleware/activityMiddleware');

router.use(authenticateToken);

router.post('/clock-in', logActivity('CLOCK_IN'), clockIn);
router.post('/clock-out', logActivity('CLOCK_OUT'), clockOut);
router.get('/today', getTodayStatus);
router.get('/logs', getLogs);
router.get('/admin/logs', requirePermission('MANAGE_ATTENDANCE'), getAllLogs);

module.exports = router;
