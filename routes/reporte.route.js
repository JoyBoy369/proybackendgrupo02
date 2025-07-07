const express = require('express');
const reporteCtrl = require('../controllers/reporte.controller');
const router = express.Router();

router.get('/filtrar', reporteCtrl.filtrarReporte);

module.exports = router;