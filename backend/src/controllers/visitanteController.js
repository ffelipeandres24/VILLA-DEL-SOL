const Visitante = require('../../models/visitante');
const ResponseFormatter = require('../utils/responseFormatter');

const visitanteController = {
  async getAll(req, res) {
    try {
      const visitantes = await Visitante.findAll();
      return ResponseFormatter.success(res, visitantes);
    } catch (error) {
      return ResponseFormatter.error(res, error.message, 500);
    }
  },

  async getById(req, res) {
    try {
      const visitante = await Visitante.findByPk(req.params.id);
      if (!visitante) {
        return ResponseFormatter.error(res, 'Visitante no encontrado', 404);
      }
      return ResponseFormatter.success(res, visitante);
    } catch (error) {
      return ResponseFormatter.error(res, error.message, 500);
    }
  },

  async create(req, res) {
    try {
      const visitante = await Visitante.create(req.body);
      return ResponseFormatter.success(res, visitante, 'Visitante registrado exitosamente', 201);
    } catch (error) {
      return ResponseFormatter.error(res, error.message, 500);
    }
  },

  async update(req, res) {
    try {
      const visitante = await Visitante.findByPk(req.params.id);
      if (!visitante) {
        return ResponseFormatter.error(res, 'Visitante no encontrado', 404);
      }
      await visitante.update(req.body);
      return ResponseFormatter.success(res, visitante);
    } catch (error) {
      return ResponseFormatter.error(res, error.message, 500);
    }
  },

  async delete(req, res) {
    try {
      const visitante = await Visitante.findByPk(req.params.id);
      if (!visitante) {
        return ResponseFormatter.error(res, 'Visitante no encontrado', 404);
      }
      await visitante.destroy();
      return ResponseFormatter.success(res, null, 'Visitante eliminado exitosamente');
    } catch (error) {
      return ResponseFormatter.error(res, error.message, 500);
    }
  },
};

module.exports = visitanteController;