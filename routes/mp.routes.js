const express = require('express');
const mpCtrl = require('../controllers/mp.controller');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

//Realiza el pago y devuelve el link de pago
router.post('/payment',authCtrl.verifyToken, mpCtrl.getPaymentLink);
//Recibe el webhook(notificación de que se realizó el pago) de Mercado Pago
router.post('/webhook',authCtrl.verifyToken, mpCtrl.handleWebhook);

module.exports = router;