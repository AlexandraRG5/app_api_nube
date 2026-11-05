const express = require('express');
const CartController = require('../controllers/CartController');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate, requireRole } = require('../middleware/auth');
const { ROLES } = require('../utils/roles');

const router = express.Router();
router.use(authenticate);

// US12 – Historial global: SOLO LECTURA para Auditor y Administrador.
// Un Cliente no puede ver carritos ajenos (403).
router.get('/', requireRole(ROLES.ADMIN, ROLES.AUDITOR), asyncHandler(CartController.index));

// US09/US10 – Mi carrito: solo Cliente (el Auditor es de solo lectura).
// Por eso Auditor y Administrador tampoco pueden modificar ni borrar carritos.
router.get('/me', requireRole(ROLES.CLIENT), asyncHandler(CartController.me));
router.post('/', requireRole(ROLES.CLIENT), asyncHandler(CartController.store));
router.put('/:id', requireRole(ROLES.CLIENT), asyncHandler(CartController.update));
router.delete('/:id/items/:productId', requireRole(ROLES.CLIENT), asyncHandler(CartController.removeItem));
router.delete('/:id', requireRole(ROLES.CLIENT), asyncHandler(CartController.clear));

module.exports = router;
