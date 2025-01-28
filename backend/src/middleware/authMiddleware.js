// **Modificaciones propuestas**

// const { jwtSecret } = require('../config/config');
// const ResponseFormatter = require('../utils/responseFormatter');

// const authMiddleware = (req, res, next) => {
//   console.log("Comprobando autorización...");
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     console.log(`Token recibido: ${token}`);

//     if (!token) {
//       console.log("¡No se proporcionó token!");
//       return ResponseFormatter.error(res, 'No token provided', 401);
//     }

//     const decoded = jwt.verify(token, jwtSecret);
//     console.log("¡Token verificado con éxito!");

//     req.user = decoded; // Añadir información del usuario decodificado a req.user
//     next();
//   } catch (error) {
//     console.error("Error con el token:", error);
//     return ResponseFormatter.error(res, 'Invalid token', 401);
//   }
// };

// module.exports = authMiddleware;const jwt = require('jsonwebtoken');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');
const ResponseFormatter = require('../utils/responseFormatter');

const authMiddleware = (req, res, next) => {
  console.log("Comprobando autorización...");
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(`Token recibido: ${token}`);

    if (!token) {
      console.log("¡No se proporcionó token!");
      return ResponseFormatter.error(res, 'No token provided', 401);
    }

    const decoded = jwt.verify(token, jwtSecret);
    console.log("¡Token verificado con éxito!");

    req.user = decoded; // Añadir información del usuario decodificado a req.user
    next();
  } catch (error) {
    console.error("Error con el token:", error);

    if (error.name === 'TokenExpiredError') {
      return ResponseFormatter.error(res, 'Token expired', 401);
    }

    return ResponseFormatter.error(res, 'Invalid token', 401);
  }
};

module.exports = authMiddleware;
