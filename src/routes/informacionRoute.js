const express = require('express');
const router = express.Router();
const informacionController = require('../controllers/informacionController');
const auth = require('../middleware/auth');

router.get('/', informacionController.getInfo);

router.put('/:id', auth,informacionController.modificarInfo);

module.exports = router;