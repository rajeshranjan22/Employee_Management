const express = require('express');
const router = express.Router();
const { getAllShifts, createShift, updateShift, deleteShift } = require('../controllers/shiftController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/permissionMiddleware');
const { logActivity } = require('../middleware/activityMiddleware');

router.use(authenticateToken);

router.get('/', getAllShifts);
router.post('/', requirePermission('MANAGE_SHIFTS'), logActivity('CREATE_SHIFT'), createShift);
router.put('/:id', requirePermission('MANAGE_SHIFTS'), logActivity('UPDATE_SHIFT'), updateShift);
router.delete('/:id', requirePermission('MANAGE_SHIFTS'), logActivity('DELETE_SHIFT'), deleteShift);

module.exports = router;
