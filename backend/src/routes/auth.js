const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, requireAuth } = require('../middleware/auth');
const { validateUserProfile, handleValidationErrors } = require('../utils/validation');
const {
  register,
  login,
  getProfile,
  updateProfile
} = require('../controllers/authController');

const router = express.Router();

// Validaciones para registro
const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
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

// Validaciones para login
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
  handleValidationErrors
];

// Rutas públicas
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Rutas protegidas
router.get('/profile', authenticateToken, requireAuth, getProfile);
router.put('/profile', authenticateToken, requireAuth, validateUserProfile, updateProfile);

module.exports = router;
