const reservaCtrl = require('./../controllers/reserva.controller');
const express = require('express');
const router = express.Router();

router.get('/buscar/:id', reservaCtrl.getReservasByUser);
router.get('/resumensemanal', reservaCtrl.getResumenSemanal);
router.get('/ingresossemanal', reservaCtrl.getIngresosSemanales);
router.get('/ingresosanuales', reservaCtrl.getIngresosAnuales);
router.get('/asistenciafuncion', reservaCtrl.getAsistenciaPorFuncion);
router.get('/ventaspelicula', reservaCtrl.getVentasPorPelicula);
router.get('/ventasultimomes', reservaCtrl.getTotalVentasUltimoMes);
router.get('/', reservaCtrl.getReservas);
router.post('/', reservaCtrl.createReserva);
router.put('/:id', reservaCtrl.editReserva);
router.delete('/:id', reservaCtrl.deleteReserva);
router.get('/:id', reservaCtrl.getReserva);

module.exports = router;