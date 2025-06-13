const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateProduct, validateCategory } = require('../utils/validation');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
} = require('../controllers/productController');

const router = express.Router();

// Rutas públicas
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

// Rutas protegidas para administradores
router.post('/', authenticateToken, requireAdmin, validateProduct, createProduct);
router.put('/:id', authenticateToken, requireAdmin, validateProduct, updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, deleteProduct);

module.exports = router;
