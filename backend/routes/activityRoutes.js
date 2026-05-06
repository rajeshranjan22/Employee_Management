const express = require('express');
const router = express.Router();
const { getAllActivityLogs } = require('../controllers/activityController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/permissionMiddleware');

router.use(authenticateToken);
router.use(requirePermission('VIEW_ACTIVITY_LOGS'));

router.get('/', getAllActivityLogs);

module.exports = router;
