const express = require('express');
const router = express.Router();
const informacionController = require('../controllers/informacionController');

router.get('/', informacionController.getInfo);

router.put('/:id', informacionController.modificarInfo);

module.exports = router;