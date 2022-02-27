const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const auth = require('../middleware/auth');

router.get('/:id', planController.getPlan);

router.get('/', planController.getPlanes);

router.post('/crear', auth, planController.crearPlan);

router.delete('/:id', auth, planController.eliminarPlan);

router.put('/:id', auth, planController.editarPlan);

module.exports = router;