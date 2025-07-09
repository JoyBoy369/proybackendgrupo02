const usuarioCtrl = require('../controllers/usuario.controller');

const express = require('express');
const usuario = require('../models/usuario');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios del sistema
 */

/**
 * @swagger
 * /api/usuario:
 *   post:
 *     summary: Crear un nuevo usuario (administración)
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Error en la creación del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Crea un usuario de cualquier tipo (para administracion)
router.post('/', usuarioCtrl.createUsuario);

/**
 * @swagger
 * /api/usuario/register:
 *   post:
 *     summary: Registrar un nuevo usuario cliente
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellido
 *               - username
 *               - password
 *               - email
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error en el registro
 */
// Crea un usuario de tipo Cliente
router.post('/register', usuarioCtrl.registerUsuario);

/**
 * @swagger
 * /api/usuario/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *                 token:
 *                   type: string
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Credenciales inválidas
 */
// Iniciar sesion
router.post('/login', usuarioCtrl.loginUsuario);

/**
 * @swagger
 * /api/usuario:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autorizado
 */
// Obtener todos los usuarios
router.get('/',authCtrl.verifyToken, usuarioCtrl.getUsuarios);

/**
 * @swagger
 * /api/usuario/rol/{rol}:
 *   get:
 *     summary: Obtener usuarios por rol
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rol
 *         required: true
 *         schema:
 *           type: string
 *         description: Rol del usuario
 *     responses:
 *       200:
 *         description: Usuarios encontrados
 *       401:
 *         description: No autorizado
 */
// Obtener usuarios por rol
router.get('/rol/:rol',authCtrl.verifyToken, usuarioCtrl.getUsuariosByRol);

/**
 * @swagger
 * /api/usuario/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 */
// Obtener un usuario por id
router.get('/:id',authCtrl.verifyToken, usuarioCtrl.getUsuario);

/**
 * @swagger
 * /api/usuario/{id}:
 *   put:
 *     summary: Editar un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       404:
 *         description: Usuario no encontrado
 */
// Editar un usuario por id
router.put('/:id',authCtrl.verifyToken, usuarioCtrl.editUsuario);

/**
 * @swagger
 * /api/usuario/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 */
// Eliminar un usuario por id
router.delete('/:id',authCtrl.verifyToken, usuarioCtrl.deleteUsuario);

/**
 * @swagger
 * /api/usuario/validator:
 *   post:
 *     summary: Validar datos de nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Validación exitosa
 */
router.post('/validator', usuarioCtrl.validarNuevoUsuario);

/**
 * @swagger
 * /api/usuario/google-login:
 *   post:
 *     summary: Login con Google
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token de Google
 *     responses:
 *       200:
 *         description: Login exitoso con Google
 */
router.post('/google-login', usuarioCtrl.googleLoginUsuario);

/**
 * @swagger
 * /api/usuario/buscar/{email}:
 *   get:
 *     summary: Buscar usuario por email
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 */
router.get('/buscar/:email', usuarioCtrl.getUsuarioByEmail);

module.exports = router;