class ResponseFormatter {
  static success(res, data, message = 'Operación exitosa', statusCode = 200) {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data,
    });
  }

  static error(res, message = 'Error desconocido', statusCode = 500) {
    return res.status(statusCode).json({
      status: 'error',
      message,
    });
  }
}

module.exports = ResponseFormatter;
