const express = require('express');
const router = express.Router();
const {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole
} = require('../controllers/roleController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/permissionMiddleware');
const { logActivity } = require('../middleware/activityMiddleware');

router.use(authenticateToken);
router.use(requirePermission('MANAGE_ROLES'));

router.get('/', getAllRoles);
router.post('/', logActivity('CREATE_ROLE'), createRole);
router.put('/:id', logActivity('UPDATE_ROLE'), updateRole);
router.delete('/:id', logActivity('DELETE_ROLE'), deleteRole);

module.exports = router;
