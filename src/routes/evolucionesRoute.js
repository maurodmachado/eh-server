const express = require('express');
const router = express.Router();
const evolucionController = require('../controllers/evolucionController');

router.post('/', evolucionController.getEvoluciones);

router.post('/crear', evolucionController.crearEvolucion);

module.exports = router;