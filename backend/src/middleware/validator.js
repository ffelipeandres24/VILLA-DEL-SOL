const { validationResult } = require('express-validator');
const ResponseFormatter = require('../utils/responseFormatter');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Errores de validación:", errors.array());
    return ResponseFormatter.error(res, 'Validation error', 400, errors.array());
  }
  next();
};

module.exports = validate;
