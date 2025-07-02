const reservaCtrl = require('./../controllers/reserva.controller');
const express = require('express');
const router = express.Router();

router.get('/', reservaCtrl.getReservas);
router.post('/', reservaCtrl.createReserva);
router.put('/:id', reservaCtrl.editReserva);
router.delete('/:id', reservaCtrl.deleteReserva);
router.get('/:id', reservaCtrl.getReserva);

module.exports = router;