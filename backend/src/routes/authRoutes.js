const express = require('express');
const { body, param } = require('express-validator');
const authController = require('../controllers/authController');
const validate = require('../middleware/validator');

const router = express.Router();

// Ruta para obtener todos los administradores
router.get('/administradores', authController.getAdministradores);

// Ruta para el login de administradores
router.post('/login', [
  body('pin').isLength({ min: 4, max: 6 }).withMessage('El PIN debe tener entre 4 y 6 dígitos'),
  validate
], authController.login);

// Ruta para registrar un nuevo administrador
router.post('/registro', [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('pin').isLength({ min: 4, max: 6 }).withMessage('El PIN debe tener entre 4 y 6 dígitos'),
  validate
], authController.registro);

// Ruta para recuperar el PIN
router.put('/recuperar-pin', [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('nuevoPin').isLength({ min: 4, max: 6 }).withMessage('El nuevo PIN debe tener entre 4 y 6 dígitos'),
  validate
], authController.recuperarPin);

// Ruta para actualizar un administrador
router.put('/administradores/:id', [
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('pin').isLength({ min: 4, max: 6 }).withMessage('El PIN debe tener entre 4 y 6 dígitos'),
  validate
], authController.updateAdministrador);

// Ruta para eliminar un administrador
router.delete('/administradores/:id', [
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  validate
], authController.deleteAdministrador);

module.exports = router;
