const express = require('express');
const reporteCtrl = require('../controllers/reporte.controller');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

/**
 * @swagger
 * tags:
 *   name: Reportes
 *   description: Generación de reportes del sistema
 */

/**
 * @swagger
 * /api/reporte/filtrar:
 *   get:
 *     summary: Filtra y genera reportes personalizados
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del filtro
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del filtro
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *         description: Tipo de reporte a generar
 *     responses:
 *       200:
 *         description: Reporte filtrado generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   description: Datos del reporte filtrado
 *       400:
 *         description: Error en los parámetros del filtro
 */
router.get('/filtrar',authCtrl.verifyToken, reporteCtrl.filtrarReporte);

module.exports = router;