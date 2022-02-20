const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/PaymentController');

router.post('/qr', paymentController.getQR);

router.post('/create-preference', paymentController.checkoutPro);

router.get('/checkpayment/:id', paymentController.getFeedback);

router.post('/webhook', paymentController.webhook);

module.exports = router;