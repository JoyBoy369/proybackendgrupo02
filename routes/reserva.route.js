/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: Gestión de reservas y reportes del sistema
 */

const reservaCtrl = require('./../controllers/reserva.controller');
const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

/**
 * @swagger
 * /api/reserva/buscar/{id}:
 *   get:
 *     summary: Busca reservas por ID de usuario
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Reservas encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reserva'
 */
// Busca reservas por ID de usuario
router.get('/buscar/:id', reservaCtrl.getReservasByUser);

/**
 * @swagger
 * /api/reserva/resumensemanal:
 *   get:
 *     summary: Obtiene resumen de reservas de la semana
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Resumen semanal obtenido exitosamente
 */
// Obtiene resumen de reservas de la semana
router.get('/resumensemanal', reservaCtrl.getResumenSemanal);

/**
 * @swagger
 * /api/reserva/ingresossemanal:
 *   get:
 *     summary: Obtiene ingresos de la semana actual
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Ingresos semanales obtenidos
 */
// Obtiene ingresos de la semana actual
router.get('/ingresossemanal', reservaCtrl.getIngresosSemanales);

/**
 * @swagger
 * /api/reserva/ingresosanuales:
 *   get:
 *     summary: Obtiene ingresos del año actual
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Ingresos anuales obtenidos
 */
// Obtiene ingresos del año actual
router.get('/ingresosanuales', reservaCtrl.getIngresosAnuales);

/**
 * @swagger
 * /api/reserva/asistenciafuncion:
 *   get:
 *     summary: Obtiene asistencia por función
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Estadísticas de asistencia obtenidas
 */
// Obtiene asistencia por función
router.get('/asistenciafuncion', reservaCtrl.getAsistenciaPorFuncion);

/**
 * @swagger
 * /api/reserva/ventaspelicula:
 *   get:
 *     summary: Obtiene ventas por película
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Estadísticas de ventas por película
 */
// Obtiene ventas por película
router.get('/ventaspelicula', reservaCtrl.getVentasPorPelicula);

/**
 * @swagger
 * /api/reserva/ventasultimomes:
 *   get:
 *     summary: Obtiene ventas del último mes
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Ventas del último mes obtenidas
 */
// Obtiene ventas del último mes
router.get('/ventasultimomes', reservaCtrl.getTotalVentasUltimoMes);

/**
 * @swagger
 * /api/reserva/reporte:
 *   get:
 *     summary: Genera reporte general de ventas
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Reporte general generado exitosamente
 */
// Genera reporte general de ventas
router.get('/reporte', reservaCtrl.getReporteVentas);

/**
 * @swagger
 * /api/reserva/reporte-peliculas:
 *   get:
 *     summary: Genera reporte de películas
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Reporte de películas generado
 */
// Genera reporte de películas
router.get('/reporte-peliculas', reservaCtrl.getReportePelículas);

/**
 * @swagger
 * /api/reserva/reporte-funciones:
 *   get:
 *     summary: Genera reporte de funciones
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Reporte de funciones generado
 */
// Genera reporte de funciones
router.get('/reporte-funciones', reservaCtrl.getReporteFunciones);

/**
 * @swagger
 * /api/reserva/reporte-reservas:
 *   get:
 *     summary: Genera reporte de reservas
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Reporte de reservas generado
 */
// Genera reporte de reservas
router.get('/reporte-reservas', reservaCtrl.getReporteReservas);

/**
 * @swagger
 * /api/reserva:
 *   get:
 *     summary: Obtiene todas las reservas
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Lista de todas las reservas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reserva'
 */
// Obtiene todas las reservas
router.get('/', reservaCtrl.getReservas);

/**
 * @swagger
 * /api/reserva:
 *   post:
 *     summary: Crea una nueva reserva
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reserva'
 *     responses:
 *       200:
 *         description: Reserva creada exitosamente
 *       400:
 *         description: Error en la creación
 */
// Crea una nueva reserva
router.post('/', reservaCtrl.createReserva);

/**
 * @swagger
 * /api/reserva/{id}:
 *   put:
 *     summary: Edita una reserva existente
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reserva'
 *     responses:
 *       200:
 *         description: Reserva actualizada exitosamente
 *       404:
 *         description: Reserva no encontrada
 */
// Edita una reserva existente
router.put('/:id', reservaCtrl.editReserva);

/**
 * @swagger
 * /api/reserva/{id}:
 *   delete:
 *     summary: Elimina una reserva
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Reserva eliminada exitosamente
 *       404:
 *         description: Reserva no encontrada
 */
// Elimina una reserva
router.delete('/:id', reservaCtrl.deleteReserva);

/**
 * @swagger
 * /api/reserva/{id}:
 *   get:
 *     summary: Obtiene una reserva por ID
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Reserva encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reserva'
 *       404:
 *         description: Reserva no encontrada
 */
// Obtiene una reserva por ID
router.get('/:id', reservaCtrl.getReserva);

/**
 * @swagger
 * /api/reserva/generar-ticket-placid:
 *   post:
 *     summary: Genera un ticket visual usando la API de Placid
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reservaId:
 *                 type: string
 *                 description: ID de la reserva
 *     responses:
 *       200:
 *         description: Ticket generado exitosamente
 *       400:
 *         description: Error al generar el ticket
 */
//Llama a la API de Placid para generar un ticket de una reserva
router.post('/generar-ticket-placid', reservaCtrl.generatePlacidTicket);

module.exports = router;