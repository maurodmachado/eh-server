const express = require('express');
const router = express.Router();
const recomendacionController = require('../controllers/recomendacionController');
const auth = require('../middleware/auth');

router.get('/:id', recomendacionController.getRecomendacion);

router.get('/', recomendacionController.getRecomendaciones);

router.post('/crear', auth, recomendacionController.crearRecomendacion);

router.delete('/:id', auth, recomendacionController.eliminarRecomendacion);

router.put('/:id', recomendacionController.modificarRecomendacion);

module.exports = router;