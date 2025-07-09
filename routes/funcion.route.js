const funcionCtrl = require('./../controllers/funcion.controller');
const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

/**
 * @swagger
 * tags:
 *   name: Funciones
 *   description: Gestión de funciones de cine
 */

// Rutas para las funciones

/**
 * @swagger
 * /api/funcion:
 *   get:
 *     summary: Obtiene todas las funciones (activas y completadas)
 *     tags: [Funciones]
 *     responses:
 *       200:
 *         description: Lista de todas las funciones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "1"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Funcion'
 */
//Trae todas las funciones(activas y completadas, la podemos usar para el admin)
router.get('/', funcionCtrl.getFunciones);

/**
 * @swagger
 * /api/funcion/activas:
 *   get:
 *     summary: Obtiene solo las funciones activas (disponibles para reservar)
 *     tags: [Funciones]
 *     responses:
 *       200:
 *         description: Lista de funciones activas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "1"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Funcion'
 */
//Trae solo las funciones activas, las que se pueden reservar
router.get('/activas',funcionCtrl.getFuncionesActivas);

/**
 * @swagger
 * /api/funcion:
 *   post:
 *     summary: Crea una nueva función
 *     tags: [Funciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pelicula
 *               - fecha
 *               - horario
 *               - sala
 *               - precio
 *             properties:
 *               pelicula:
 *                 type: string
 *                 example: "60f7d2f4e1b2c4001f8e4567"
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-15"
 *               horario:
 *                 type: string
 *                 example: "19:30"
 *               sala:
 *                 type: string
 *                 example: "Sala 1"
 *               precio:
 *                 type: number
 *                 example: 12.50
 *               asientosDisponibles:
 *                 type: number
 *                 example: 100
 *     responses:
 *       200:
 *         description: Función creada exitosamente
 *       401:
 *         description: No autorizado
 */
//Crea una función
router.post('/',authCtrl.verifyToken, funcionCtrl.createFuncion);

/**
 * @swagger
 * /api/funcion/por-fecha/{fecha}:
 *   get:
 *     summary: Filtra funciones activas por fecha
 *     tags: [Funciones]
 *     parameters:
 *       - in: path
 *         name: fecha
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha en formato YYYY-MM-DD
 *         example: "2025-07-15"
 *     responses:
 *       200:
 *         description: Funciones encontradas para la fecha especificada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Funcion'
 */
//Filtrar funciones por fecha mientras esten activas
router.get('/por-fecha/:fecha', funcionCtrl.getFuncionesPorFecha);

/**
 * @swagger
 * /api/funcion/pelicula/{nombrePelicula}:
 *   get:
 *     summary: Filtra funciones activas por nombre de película
 *     tags: [Funciones]
 *     parameters:
 *       - in: path
 *         name: nombrePelicula
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de la película
 *         example: "Avatar"
 *     responses:
 *       200:
 *         description: Funciones encontradas para la película especificada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Funcion'
 */
//Filtrar funciones por nombre de la película mientras esten activas
router.get('/pelicula/:nombrePelicula', funcionCtrl.getFuncionesPorNombrePelicula);

/**
 * @swagger
 * /api/funcion/{id}:
 *   get:
 *     summary: Obtiene una función por ID
 *     tags: [Funciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único de la función
 *     responses:
 *       200:
 *         description: Función encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Funcion'
 *       404:
 *         description: Función no encontrada
 */
//Trae una función por id
router.get('/:id', funcionCtrl.getFuncion);

/**
 * @swagger
 * /api/funcion/{id}:
 *   put:
 *     summary: Edita una función por ID
 *     tags: [Funciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único de la función
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Funcion'
 *     responses:
 *       200:
 *         description: Función actualizada exitosamente
 *       404:
 *         description: Función no encontrada
 *       401:
 *         description: No autorizado
 */
//Edita funciones (no la implementé en el front)
router.put('/:id',authCtrl.verifyToken, funcionCtrl.editFuncion);

/**
 * @swagger
 * /api/funcion/{id}:
 *   delete:
 *     summary: Elimina una función por ID
 *     tags: [Funciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único de la función
 *     responses:
 *       200:
 *         description: Función eliminada exitosamente
 *       404:
 *         description: Función no encontrada
 *       401:
 *         description: No autorizado
 */
//Elimina una función
router.delete('/:id',authCtrl.verifyToken, funcionCtrl.deleteFuncion);

//Ruta para probar que las funciones se archiven
// router.get('/prueba/probar-archivar-funciones', async (req, res) => {
//     console.log('Disparando manualmente archivePastFunciones...');
//     const result = await funcionCtrl.archivePastFunciones();
//     res.status(200).json(result);
// });


module.exports = router;