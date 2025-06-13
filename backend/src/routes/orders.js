const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, requireAuth, requireAdmin } = require('../middleware/auth');
const { validateOrder, handleValidationErrors } = require('../utils/validation');
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus
} = require('../controllers/orderController');

const router = express.Router();

// Validación para actualizar estado de orden
const validateOrderStatus = [
  body('status')
    .isIn(['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'])
    .withMessage('Estado de orden inválido'),
  handleValidationErrors
];

// Todas las rutas de órdenes requieren autenticación
router.use(authenticateToken, requireAuth);

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', validateOrder, createOrder);

// Solo administradores pueden actualizar el estado de las órdenes
router.put('/:id/status', requireAdmin, validateOrderStatus, updateOrderStatus);

module.exports = router;
