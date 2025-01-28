const express = require('express');
const { body } = require('express-validator');
const Propietario = require('../../models/propietario');
const ResponseFormatter = require('../utils/responseFormatter');
const validate = require('../middleware/validator');
const authMiddleware = require('../middleware/authMiddleware'); // Importa el middleware de autenticación

const router = express.Router();

// Ruta de registro
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Debe ser un correo válido'),
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    validate,
  ],
  async (req, res) => {
    try {
      const { nombre, email } = req.body;

      // Verifica si el email ya está registrado
      const existingUser = await Propietario.findOne({ where: { email } });
      if (existingUser) {
        return ResponseFormatter.error(res, 'El email ya está registrado', 400);
      }

      // Crea el nuevo propietario
      const propietario = await Propietario.create({
        nombre,
        email,
      });

      return ResponseFormatter.success(res, propietario, 'Propietario registrado con éxito');
    } catch (error) {
      return ResponseFormatter.error(res, error.message, 500);
    }
  }
);

// Rutas protegidas por autenticación (requieren el token JWT)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const propietarios = await Propietario.findAll({
      attributes: { exclude: ['password'] }, // Excluir la contraseña
    });
    return ResponseFormatter.success(res, propietarios);
  } catch (error) {
    return ResponseFormatter.error(res, error.message, 500);
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const propietario = await Propietario.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });
    if (!propietario) {
      return ResponseFormatter.error(res, 'Propietario no encontrado', 404);
    }
    return ResponseFormatter.success(res, propietario);
  } catch (error) {
    return ResponseFormatter.error(res, error.message, 500);
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const propietario = await Propietario.findByPk(req.params.id);
    if (!propietario) {
      return ResponseFormatter.error(res, 'Propietario no encontrado', 404);
    }
    // Actualizar solo nombre y email
    const { nombre, email } = req.body;
    await propietario.update({ nombre, email });
    return ResponseFormatter.success(res, propietario);
  } catch (error) {
    return ResponseFormatter.error(res, error.message, 500);
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const propietario = await Propietario.findByPk(req.params.id);
    if (!propietario) {
      return ResponseFormatter.error(res, 'Propietario no encontrado', 404);
    }
    await propietario.destroy();
    return ResponseFormatter.success(res, null, 'Propietario eliminado exitosamente');
  } catch (error) {
    return ResponseFormatter.error(res, error.message, 500);
  }
});

module.exports = router;
