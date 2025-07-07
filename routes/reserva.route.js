const reservaCtrl = require('./../controllers/reserva.controller');
const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

// Busca reservas por ID de usuario
router.get('/buscar/:id',authCtrl.verifyToken, reservaCtrl.getReservasByUser);
// Obtiene resumen de reservas de la semana
router.get('/resumensemanal',authCtrl.verifyToken, reservaCtrl.getResumenSemanal);
// Obtiene ingresos de la semana actual
router.get('/ingresossemanal',authCtrl.verifyToken, reservaCtrl.getIngresosSemanales);
// Obtiene ingresos del año actual
router.get('/ingresosanuales',authCtrl.verifyToken, reservaCtrl.getIngresosAnuales);
// Obtiene asistencia por función
router.get('/asistenciafuncion',authCtrl.verifyToken, reservaCtrl.getAsistenciaPorFuncion);
// Obtiene ventas por película
router.get('/ventaspelicula',authCtrl.verifyToken, reservaCtrl.getVentasPorPelicula);
// Obtiene ventas del último mes
router.get('/ventasultimomes',authCtrl.verifyToken, reservaCtrl.getTotalVentasUltimoMes);
// Genera reporte general de ventas
router.get('/reporte',authCtrl.verifyToken, reservaCtrl.getReporteVentas);
// Genera reporte de películas
router.get('/reporte-peliculas',authCtrl.verifyToken, reservaCtrl.getReportePelículas);
// Genera reporte de funciones
router.get('/reporte-funciones',authCtrl.verifyToken, reservaCtrl.getReporteFunciones);
// Genera reporte de reservas
router.get('/reporte-reservas',authCtrl.verifyToken, reservaCtrl.getReporteReservas);
// Obtiene todas las reservas
router.get('/',authCtrl.verifyToken, reservaCtrl.getReservas);
// Crea una nueva reserva
router.post('/',authCtrl.verifyToken, reservaCtrl.createReserva);
// Edita una reserva existente
router.put('/:id',authCtrl.verifyToken, reservaCtrl.editReserva);
// Elimina una reserva
router.delete('/:id',authCtrl.verifyToken, reservaCtrl.deleteReserva);
// Obtiene una reserva por ID
router.get('/:id',authCtrl.verifyToken, reservaCtrl.getReserva);
//Llama a la API de Placid para generar un ticket de una reserva
router.post('/generar-ticket-placid',authCtrl.verifyToken, reservaCtrl.generatePlacidTicket);

module.exports = router;