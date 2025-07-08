const usuarioCtrl = require('../controllers/usuario.controller');

const express = require('express');
const usuario = require('../models/usuario');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

// Crea un usuario de cualquier tipo (para administracion)
router.post('/', usuarioCtrl.createUsuario);
// Crea un usuario de tipo Cliente
router.post('/register', usuarioCtrl.registerUsuario);
// Iniciar sesion
router.post('/login', usuarioCtrl.loginUsuario);
// Obtener todos los usuarios
router.get('/',authCtrl.verifyToken, usuarioCtrl.getUsuarios);
// Obtener usuarios por rol
router.get('/rol/:rol',authCtrl.verifyToken, usuarioCtrl.getUsuariosByRol);
// Obtener un usuario por id
router.get('/:id',authCtrl.verifyToken, usuarioCtrl.getUsuario);
// Editar un usuario por id
router.put('/:id',authCtrl.verifyToken, usuarioCtrl.editUsuario);
// Eliminar un usuario por id
router.delete('/:id',authCtrl.verifyToken, usuarioCtrl.deleteUsuario);
router.post('/validator', usuarioCtrl.validarNuevoUsuario);
router.post('/google-login', usuarioCtrl.googleLoginUsuario);
router.get('/buscar/:email', usuarioCtrl.getUsuarioByEmail);

module.exports = router;