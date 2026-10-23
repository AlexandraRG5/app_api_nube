const express = require('express');
const UserController = require('../controllers/UserController');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate, requireRole } = require('../middleware/auth');
const { ROLES } = require('../utils/roles');

const router = express.Router();
router.use(authenticate);

router.get('/', requireRole(ROLES.ADMIN, ROLES.AUDITOR), asyncHandler(UserController.index));
router.get('/:id', requireRole(ROLES.ADMIN, ROLES.AUDITOR), asyncHandler(UserController.show));
router.post('/', requireRole(ROLES.ADMIN), asyncHandler(UserController.store));

module.exports = router;
