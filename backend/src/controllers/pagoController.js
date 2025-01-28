const Pago = require('../../models/pago');
const ResponseFormatter = require('../utils/responseFormatter');

const pagoController = {
  async getAll(req, res) {
    try {
      const pagos = await Pago.findAll();
      return ResponseFormatter.success(res, pagos);
    } catch (error) {
      return ResponseFormatter.error(res, error.message, 500);
    }
  },

  async getById(req, res) {
    try {
      const pago = await Pago.findByPk(req.params.id);
      if (!pago) {
        return ResponseFormatter.error(res, 'Pago no encontrado', 404);
      }
      return ResponseFormatter.success(res, pago);
    } catch (error) {
      return ResponseFormatter.error(res, error.message, 500);
    }
  },

  async create(req, res) {
    try {
      const pago = await Pago.create(req.body);
      return ResponseFormatter.success(res, pago, 'Pago registrado exitosamente', 201);
    } catch (error) {
      return ResponseFormatter.error(res, error.message, 500);
    }
  },

  async update(req, res) {
    try {
      const pago = await Pago.findByPk(req.params.id);
      if (!pago) {
        return ResponseFormatter.error(res, 'Pago no encontrado', 404);
      }
      await pago.update(req.body);
      return ResponseFormatter.success(res, pago);
    } catch (error) {
      return ResponseFormatter.error(res, error.message, 500);
    }
  },

  async delete(req, res) {
    try {
      const pago = await Pago.findByPk(req.params.id);
      if (!pago) {
        return ResponseFormatter.error(res, 'Pago no encontrado', 404);
              }
              await pago.destroy();
              return ResponseFormatter.success(res, null, 'Propietario eliminado exitosamente');
            } catch (error) {
              return ResponseFormatter.error(res, error.message, 500);
            }
          },
        };
        
        module.exports = pagoController;