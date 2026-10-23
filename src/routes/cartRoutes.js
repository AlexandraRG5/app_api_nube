const express = require('express');
const CartController = require('../controllers/CartController');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate, requireRole } = require('../middleware/auth');
const { ROLES } = require('../utils/roles');

const router = express.Router();

// El carrito es solo para el rol Cliente (US09: el Auditor es solo lectura).
// Se valida en el servidor, no solo ocultando botones en la app.
router.use(authenticate, requireRole(ROLES.CLIENT));

router.get('/me', asyncHandler(CartController.me));
router.post('/', asyncHandler(CartController.store));
router.put('/:id', asyncHandler(CartController.update));
router.delete('/:id/items/:productId', asyncHandler(CartController.removeItem));
router.delete('/:id', asyncHandler(CartController.clear));

module.exports = router;
