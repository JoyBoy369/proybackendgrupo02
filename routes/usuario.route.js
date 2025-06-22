const usuarioCtrl = require('../controllers/usuario.controller');

const express = require('express');
const usuario = require('../models/usuario');
const router = express.Router();

router.post('/', usuarioCtrl.createUsuario);
router.post('/register', usuarioCtrl.registerUsuario);
router.post('/login', usuarioCtrl.loginUsuario);
router.get('/', usuarioCtrl.getUsuarios);
router.get('/rol/:rol', usuarioCtrl.getUsuariosByRol);
router.get('/:id', usuarioCtrl.getUsuario);
router.put('/:id', usuarioCtrl.editUsuario);
router.delete('/:id', usuarioCtrl.deleteUsuario);

module.exports = router;