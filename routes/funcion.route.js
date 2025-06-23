const express = require('express');
const funcionCtrl = require('../controllers/funcion.controller');
const router = express.Router();

router.post('/', funcionCtrl.createFuncion);
router.get('/', funcionCtrl.getFunciones);
router.get('/:id', funcionCtrl.getFuncion);
router.put('/:id', funcionCtrl.editFuncion);
router.delete('/:id', funcionCtrl.deleteFuncion);

module.exports = router;