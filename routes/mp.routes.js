const express = require('express');
const mpCtrl = require('../controllers/mp.controller');
const router = express.Router();

//Realiza el pago y devuelve el link de pago
router.post('/payment', mpCtrl.getPaymentLink);
//Recibe el webhook(notificación de que se realizó el pago) de Mercado Pago
router.post('/webhook', mpCtrl.handleWebhook);

module.exports = router;