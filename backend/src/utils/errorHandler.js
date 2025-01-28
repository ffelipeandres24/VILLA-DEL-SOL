class ErrorHandler {
  static handle(err, req, res, next) {
    console.error("¡Error detectado!", err);
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
      status: 'error',
      message: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
}

module.exports = ErrorHandler;
