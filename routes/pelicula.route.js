
const peliculaCtrl = require('./../controllers/pelicula.controller');

const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

/**
 * @swagger
 * tags:
 *   name: Películas
 *   description: Gestión de películas del sistema
 */

/**
 * @swagger
 * /api/pelicula:
 *   get:
 *     summary: Obtiene todas las películas
 *     tags: [Películas]
 *     responses:
 *       200:
 *         description: Lista de películas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "1"
 *                 msg:
 *                   type: string
 *                   example: "Películas obtenidas exitosamente"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pelicula'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
//Obtiene las peliculas de la base de datos
router.get('/', peliculaCtrl.getPeliculas);

/**
 * @swagger
 * /api/pelicula/{id}:
 *   get:
 *     summary: Obtiene una película por ID
 *     tags: [Películas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único de la película
 *     responses:
 *       200:
 *         description: Película encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "1"
 *                 data:
 *                   $ref: '#/components/schemas/Pelicula'
 *       404:
 *         description: Película no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
//Obtiene una película por id
router.get('/:id', peliculaCtrl.getPelicula);

/**
 * @swagger
 * /api/pelicula:
 *   post:
 *     summary: Crea una nueva película
 *     tags: [Películas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - genero
 *               - duracion
 *               - director
 *               - reparto
 *               - sinopsis
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Avatar: El Camino del Agua"
 *               genero:
 *                 type: string
 *                 example: "Ciencia Ficción"
 *               duracion:
 *                 type: number
 *                 example: 192
 *               director:
 *                 type: string
 *                 example: "James Cameron"
 *               reparto:
 *                 type: string
 *                 example: "Sam Worthington, Zoe Saldana"
 *               sinopsis:
 *                 type: string
 *                 example: "Jake Sully vive con su nueva familia formada en el planeta de Pandora..."
 *               poster:
 *                 type: string
 *                 example: "https://example.com/poster.jpg"
 *               estado:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Película creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Error en la validación de datos
 *       401:
 *         description: No autorizado
 */
//Crea una nueva película
router.post('/',authCtrl.verifyToken, peliculaCtrl.createPelicula);

/**
 * @swagger
 * /api/pelicula/{id}:
 *   put:
 *     summary: Actualiza una película por ID
 *     tags: [Películas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único de la película
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pelicula'
 *     responses:
 *       200:
 *         description: Película actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Película no encontrada
 *       401:
 *         description: No autorizado
 */
//Actualiza una película por id
router.put('/:id',authCtrl.verifyToken, peliculaCtrl.updatePelicula);

/**
 * @swagger
 * /api/pelicula/{id}:
 *   delete:
 *     summary: Elimina una película por ID
 *     tags: [Películas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único de la película
 *     responses:
 *       200:
 *         description: Película eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Película no encontrada
 *       401:
 *         description: No autorizado
 */
//Elimina una película por id
router.delete('/:id',authCtrl.verifyToken, peliculaCtrl.deletePelicula);

module.exports = router;