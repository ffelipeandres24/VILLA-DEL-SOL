const sequelize = require('../config/database'); // Configuración de la base de datos
const { DataTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');
const Administrador = require('../../models/Administrador')(sequelize, DataTypes);
const ResponseFormatter = require('../utils/responseFormatter');

const authController = {
  // Login del administrador
  async login(req, res) {
    try {
      const { pin } = req.body;

      // Validar PIN vacío
      if (!pin) {
        return ResponseFormatter.error(res, 'Por favor ingrese el PIN', 400);
      }

      // Buscar administrador por PIN
      const administrador = await Administrador.findOne({ where: { pin } });
      if (!administrador) {
        return ResponseFormatter.error(res, 'Credenciales inválidas', 401);
      }

      // Generar el token JWT
      const token = jwt.sign({ id: administrador.id, nombre: administrador.nombre }, jwtSecret, { expiresIn: '24h' });

      // Generar refresh token
      const refreshToken = jwt.sign({ id: administrador.id, nombre: administrador.nombre }, jwtSecret, { expiresIn: '7d' });

      return ResponseFormatter.success(res, { token, refreshToken }, 'Login exitoso', 200);
    } catch (error) {
      console.error("Error en el login:", error);
      return ResponseFormatter.error(res, 'Error en el servidor', 500);
    }
  },

  // Registro de un nuevo administrador
  async registro(req, res) {
    try {
      const { nombre, pin } = req.body;

      // Validar duplicados
      const existingAdmin = await Administrador.findOne({ where: { pin } });
      if (existingAdmin) {
        return ResponseFormatter.error(res, 'Este PIN ya está registrado', 400);
      }

      // Crear el nuevo administrador
      const nuevoAdministrador = await Administrador.create({ nombre, pin });
      return ResponseFormatter.success(res, nuevoAdministrador, 'Administrador registrado exitosamente', 201);
    } catch (error) {
      console.error("Error al registrar administrador:", error);
      return ResponseFormatter.error(res, 'Error en el servidor', 500);
    }
  },

  // Recuperar el PIN de un administrador
  async recuperarPin(req, res) {
    try {
      const { nombre, nuevoPin } = req.body;

      const administrador = await Administrador.findOne({ where: { nombre } });
      if (!administrador) {
        return ResponseFormatter.error(res, 'Administrador no encontrado', 404);
      }

      administrador.pin = nuevoPin;
      await administrador.save();

      return ResponseFormatter.success(res, administrador, 'PIN actualizado exitosamente', 200);
    } catch (error) {
      console.error("Error al recuperar el PIN:", error);
      return ResponseFormatter.error(res, 'Error en el servidor', 500);
    }
  },

  // Obtener todos los administradores
  async getAdministradores(req, res) {
    try {
      const administradores = await Administrador.findAll();
      return ResponseFormatter.success(res, administradores, 'Administradores recuperados exitosamente', 200);
    } catch (error) {
      console.error("Error al obtener administradores:", error);
      return ResponseFormatter.error(res, 'Error en el servidor', 500);
    }
  },

  // Actualizar un administrador
  async updateAdministrador(req, res) {
    try {
      const { id } = req.params;
      const { nombre, pin } = req.body;

      const administrador = await Administrador.findByPk(id);
      if (!administrador) {
        return ResponseFormatter.error(res, 'Administrador no encontrado', 404);
      }

      administrador.nombre = nombre;
      administrador.pin = pin;
      await administrador.save();

      return ResponseFormatter.success(res, administrador, 'Administrador actualizado exitosamente', 200);
    } catch (error) {
      console.error("Error al actualizar administrador:", error);
      return ResponseFormatter.error(res, 'Error en el servidor', 500);
    }
  },

  // Eliminar un administrador
  async deleteAdministrador(req, res) {
    try {
      const { id } = req.params;

      const administrador = await Administrador.findByPk(id);
      if (!administrador) {
        return ResponseFormatter.error(res, 'Administrador no encontrado', 404);
      }

      await administrador.destroy();

      return ResponseFormatter.success(res, null, 'Administrador eliminado exitosamente', 200);
    } catch (error) {
      console.error("Error al eliminar administrador:", error);
      return ResponseFormatter.error(res, 'Error en el servidor', 500);
    }
  }
};

module.exports = authController;
