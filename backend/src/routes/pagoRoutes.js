const express = require('express');
const { body } = require('express-validator');
const pagoController = require('../controllers/pagoController');
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validator');

const router = express.Router();

router.use(auth);

router.get('/', pagoController.getAll);
 router.get('/:id', pagoController.getById);
router.post('/', [
  body('propietario_id').isInt(),
     body('monto').isFloat({ min: 0 }),
    body('fecha_pago').isISO8601(),
  body('concepto').notEmpty(),
   body('estado').isIn(['pendiente', 'pagado', 'vencido']),
  validate
],  pagoController.create);

router.put('/:id', [
  body('monto').optional().isFloat({ min: 0 }),
    body('fecha_pago').optional().isISO8601(),
  body('concepto').optional().notEmpty(),
   body('estado').optional().isIn(['pendiente', 
    'pagado', 'vencido']),
  validate
], pagoController.update);

 router.delete('/:id', pagoController.delete);

module.exports = router;