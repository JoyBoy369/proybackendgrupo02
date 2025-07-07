const express = require('express');
const reporteCtrl = require('../controllers/reporte.controller');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

router.get('/filtrar',authCtrl.verifyToken, reporteCtrl.filtrarReporte);

module.exports = router;