const reservaCtrl = require('./../controllers/reserva.controller');
const express = require('express');
const router = express.Router();

// Busca reservas por ID de usuario
router.get('/buscar/:id', reservaCtrl.getReservasByUser);
// Obtiene resumen de reservas de la semana
router.get('/resumensemanal', reservaCtrl.getResumenSemanal);
// Obtiene ingresos de la semana actual
router.get('/ingresossemanal', reservaCtrl.getIngresosSemanales);
// Obtiene ingresos del año actual
router.get('/ingresosanuales', reservaCtrl.getIngresosAnuales);
// Obtiene asistencia por función
router.get('/asistenciafuncion', reservaCtrl.getAsistenciaPorFuncion);
// Obtiene ventas por película
router.get('/ventaspelicula', reservaCtrl.getVentasPorPelicula);
// Obtiene ventas del último mes
router.get('/ventasultimomes', reservaCtrl.getTotalVentasUltimoMes);
// Genera reporte general de ventas
router.get('/reporte', reservaCtrl.getReporteVentas);
// Genera reporte de películas
router.get('/reporte-peliculas', reservaCtrl.getReportePelículas);
// Genera reporte de funciones
router.get('/reporte-funciones', reservaCtrl.getReporteFunciones);
// Genera reporte de reservas
router.get('/reporte-reservas', reservaCtrl.getReporteReservas);
// Obtiene todas las reservas
router.get('/', reservaCtrl.getReservas);
// Crea una nueva reserva
router.post('/', reservaCtrl.createReserva);
// Edita una reserva existente
router.put('/:id', reservaCtrl.editReserva);
// Elimina una reserva
router.delete('/:id', reservaCtrl.deleteReserva);
// Obtiene una reserva por ID
router.get('/:id', reservaCtrl.getReserva);
//Llama a la API de Placid para generar un ticket de una reserva
router.post('/generar-ticket-placid', reservaCtrl.generatePlacidTicket);

module.exports = router;