const funcionCtrl = require('./../controllers/funcion.controller');

const express = require('express');
const router = express.Router();

router.get('/', funcionCtrl.getFunciones);
router.get('/activas/', funcionCtrl.getFuncionesActivas);
router.post('/', funcionCtrl.createFuncion);
router.put('/:id', funcionCtrl.editFuncion);
router.delete('/:id', funcionCtrl.deleteFuncion);
router.get('/:id', funcionCtrl.getFuncion);

//exportamos el modulo de rutas
module.exports = router;