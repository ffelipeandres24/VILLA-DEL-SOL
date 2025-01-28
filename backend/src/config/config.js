require('dotenv').config();

console.log('Variables de entorno cargadas:');
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);

module.exports = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET ||'villadelSol2024_secret_key_!@#$%' ,
  jwtExpiration: '24h',
  environment: process.env.NODE_ENV || 'development',
  corsOptions: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    optionsSuccessStatus: 200
  }
};