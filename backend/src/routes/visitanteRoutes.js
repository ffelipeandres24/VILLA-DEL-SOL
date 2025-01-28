const express = require('express');
const { body, param } = require('express-validator');
const visitanteController = require('../controllers/visitanteController');
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validator');

const router = express.Router();

// Middleware para verificar la autenticación
router.use(auth);

// Obtener todos los visitantes
router.get('/', visitanteController.getAll);

// Obtener un visitante por ID
router.get('/:id', [
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  validate
], visitanteController.getById);

// Registrar un nuevo visitante
router.post('/', [
  body('apartamento_id').isInt().withMessage('El ID del apartamento debe ser un número entero'),
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('documento').notEmpty().withMessage('El documento es obligatorio'),
  body('fecha_entrada').isISO8601().withMessage('La fecha de entrada debe ser válida'),
  body('motivo_visita').notEmpty().withMessage('El motivo de la visita es obligatorio'),
  validate
], visitanteController.create);

// Actualizar un visitante
router.put('/:id', [
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  body('fecha_salida').optional().isISO8601().withMessage('La fecha de salida debe ser válida'),
  body('estado').optional().isIn(['activo', 'finalizado']).withMessage('El estado debe ser "activo" o "finalizado"'),
  validate
], visitanteController.update);

// Eliminar un visitante
router.delete('/:id', [
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  validate
], visitanteController.delete);

module.exports = router;
