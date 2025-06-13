const express = require('express');
const { authenticateToken, requireAuth } = require('../middleware/auth');
const { validateCartItem } = require('../utils/validation');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

const router = express.Router();

// Todas las rutas del carrito requieren autenticación
router.use(authenticateToken, requireAuth);

router.get('/', getCart);
router.post('/', validateCartItem, addToCart);
router.put('/:id', validateCartItem, updateCartItem);
router.delete('/:id', removeFromCart);
router.delete('/', clearCart);

module.exports = router;
