const { body, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Datos de entrada inválidos',
      details: errors.array()
    });
  }
  next();
};

// Validaciones para productos
const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('El nombre debe tener entre 1 y 200 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede exceder 1000 caracteres'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número entero positivo'),
  body('category_id')
    .isUUID()
    .withMessage('ID de categoría inválido'),
  body('image_url')
    .optional()
    .isURL()
    .withMessage('URL de imagen inválida'),
  handleValidationErrors
];

// Validaciones para categorías
const validateCategory = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('El nombre debe tener entre 1 y 100 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres'),
  handleValidationErrors
];

// Validaciones para carrito
const validateCartItem = [
  body('product_id')
    .isUUID()
    .withMessage('ID de producto inválido'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero positivo'),
  handleValidationErrors
];

// Validaciones para órdenes
const validateOrder = [
  body('delivery_address')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('La dirección de entrega debe tener entre 10 y 500 caracteres'),
  body('phone')
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage('El teléfono debe tener entre 8 y 20 caracteres'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Las notas no pueden exceder 500 caracteres'),
  handleValidationErrors
];

// Validaciones para perfil de usuario
const validateUserProfile = [
  body('full_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('El nombre completo debe tener entre 2 y 200 caracteres'),
  body('phone')
    .optional()
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage('El teléfono debe tener entre 8 y 20 caracteres'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La dirección no puede exceder 500 caracteres'),
  handleValidationErrors
];

module.exports = {
  validateProduct,
  validateCategory,
  validateCartItem,
  validateOrder,
  validateUserProfile,
  handleValidationErrors
};
