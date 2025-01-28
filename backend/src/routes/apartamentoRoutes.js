const express = require('express');
const { body } = require('express-validator');
const apartamentoController = require('../controllers/apartamentoController');
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validator');

const router = express.Router();

router.use(auth);

router.get('/', apartamentoController.getAll);

 router.get('/:id', apartamentoController.getById);
 
router.post('/', [
    body('numero').isInt(),
    body('bloque').notEmpty(),
  body('metros_cuadrados').isInt(),
  body('propietario_id').isInt(),
  validate
], apartamentoController.create);
router.put('/:id', [
   body('numero').optional().isInt(),
    body('bloque').optional().notEmpty(),
    body('metros_cuadrados').optional().isInt(),
  body('propietario_id').optional().isInt(),
  validate
], apartamentoController.update);
router.delete('/:id', apartamentoController.delete);

module.exports = router;
