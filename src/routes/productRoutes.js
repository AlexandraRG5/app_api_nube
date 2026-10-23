const express = require('express');
const ProductController = require('../controllers/ProductController');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate, requireRole } = require('../middleware/auth');
const { ROLES } = require('../utils/roles');

const router = express.Router();
router.use(authenticate);

// Lectura: cualquier usuario autenticado (administrador, auditor o cliente).
// IMPORTANTE: /categories y /category/:category van ANTES de /:id.
router.get('/categories', asyncHandler(ProductController.categories));
router.get('/category/:category', asyncHandler(ProductController.byCategory));
router.get('/', asyncHandler(ProductController.index));
router.get('/:id', asyncHandler(ProductController.show));

// Escritura: solo administrador (se valida en el servidor, no solo en la app).
router.post('/', requireRole(ROLES.ADMIN), asyncHandler(ProductController.store));
router.put('/:id', requireRole(ROLES.ADMIN), asyncHandler(ProductController.update));
router.delete('/:id', requireRole(ROLES.ADMIN), asyncHandler(ProductController.destroy));

module.exports = router;
