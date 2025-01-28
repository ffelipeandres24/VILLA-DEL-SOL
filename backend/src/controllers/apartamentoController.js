const Apartamento = require('../../models/apartamento');
const Propietario = require('../../models/propietario');  // Asegúrate de incluir el modelo Propietario
const ResponseFormatter = require('../utils/responseFormatter');

const apartamentoController = {
  async getAll(req, res) {
    try {
      // aqui seobtieneeeeen  los apartamentos junto con los propietarios
      const apartamentos = await Apartamento.findAll({
        include: [{ model: Propietario }]
      });

      if (!apartamentos || apartamentos.length === 0) {
        return ResponseFormatter.error(res, 'No se encontraron apartamentos', 404);
      }

      
      const apartamentosPlain = Array.isArray(apartamentos) ? apartamentos.map(apartamento => apartamento.toJSON()) : [];

      return ResponseFormatter.success(res, apartamentosPlain);
    } catch (error) {
      console.error(error);  
      return ResponseFormatter.error(res, 'Error al obtener los apartamentos', 500);
    }
  },

  async getById(req, res) {
    try {
      // Obtenemos el apartamento por ID junto con su propietario
      const apartamento = await Apartamento.findByPk(req.params.id, {
        include: [{ model: Propietario }]  // el propietario en la consulta
      });

      if (!apartamento) {
        return ResponseFormatter.error(res, 'Apartamento no encontrado', 404);
      }

      // Convertir a objeto plano
      return ResponseFormatter.success(res, apartamento.toJSON());
    } catch (error) {
      console.error(error);
      return ResponseFormatter.error(res, 'Error al obtener el apartamento', 500);
    }
  },

  async create(req, res) {
    const { numero, bloque, metros_cuadrados, propietario_id } = req.body;

    // Validación de datos
    if (!numero || !bloque || !metros_cuadrados || !propietario_id) {
      return ResponseFormatter.error(res, 'Faltan datos obligatorios para crear el apartamento', 400);
    }

    try {
      const apartamento = await Apartamento.create({
        numero,
        bloque,
        metros_cuadrados,
        propietario_id
      });
      return ResponseFormatter.success(res, apartamento.toJSON(), 'Apartamento creado exitosamente', 201);
    } catch (error) {
      console.error(error);
      return ResponseFormatter.error(res, 'Error al crear el apartamento', 500);
    }
  },

  async update(req, res) {
    const { numero, bloque, metros_cuadrados, propietario_id } = req.body;

    // Validación de los datos
    if (!numero || !bloque || !metros_cuadrados || !propietario_id) {
      return ResponseFormatter.error(res, 'Faltan datos obligatorios para actualizar el apartamento', 400);
    }

    try {
      const apartamento = await Apartamento.findByPk(req.params.id);
      if (!apartamento) {
        return ResponseFormatter.error(res, 'Apartamento no encontrado', 404);
      }

      await apartamento.update({
        numero,
        bloque,
        metros_cuadrados,
        propietario_id
      });

      return ResponseFormatter.success(res, apartamento.toJSON(), 'Apartamento actualizado exitosamente');
    } catch (error) {
      console.error(error); 
      return ResponseFormatter.error(res, 'Error al actualizar el apartamento', 500);
    }
  },

  async delete(req, res) {
    try {
      const apartamento = await Apartamento.findByPk(req.params.id);
      if (!apartamento) {
        return ResponseFormatter.error(res, 'Apartamento no encontrado', 404);
      }

      await apartamento.destroy();
      return ResponseFormatter.success(res, null, 'Apartamento eliminado exitosamente');
    } catch (error) {
      console.error(error); 
      return ResponseFormatter.error(res, 'Error al eliminar el apartamento', 500);
    }
  },
};

module.exports = apartamentoController;
