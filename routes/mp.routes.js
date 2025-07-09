const express = require('express');
const mpCtrl = require('../controllers/mp.controller');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

/**
 * @swagger
 * tags:
 *   name: Mercado Pago
 *   description: Integración con Mercado Pago para pagos
 */

/**
 * @swagger
 * /api/mp/payment:
 *   post:
 *     summary: Genera un link de pago de Mercado Pago
 *     tags: [Mercado Pago]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título del producto/servicio
 *               price:
 *                 type: number
 *                 description: Precio del producto
 *               quantity:
 *                 type: number
 *                 description: Cantidad
 *     responses:
 *       200:
 *         description: Link de pago generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paymentUrl:
 *                   type: string
 *                   description: URL para realizar el pago
 *       400:
 *         description: Error al generar el link de pago
 */
//Realiza el pago y devuelve el link de pago
router.post('/payment',authCtrl.verifyToken, mpCtrl.getPaymentLink);

/**
 * @swagger
 * /api/mp/webhook:
 *   post:
 *     summary: Webhook para recibir notificaciones de Mercado Pago
 *     tags: [Mercado Pago]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Datos del webhook de Mercado Pago
 *     responses:
 *       200:
 *         description: Webhook procesado exitosamente
 *       400:
 *         description: Error al procesar el webhook
 */
//Recibe el webhook(notificación de que se realizó el pago) de Mercado Pago
router.post('/webhook',authCtrl.verifyToken, mpCtrl.handleWebhook);

module.exports = router;