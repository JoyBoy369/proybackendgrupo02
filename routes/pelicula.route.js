
const peliculaCtrl = require('./../controllers/pelicula.controller');

const express = require('express');
const router = express.Router();

//Obtiene las peliculas de la base de datos
router.get('/', peliculaCtrl.getPeliculas);
//Obtiene una película por id
router.get('/:id', peliculaCtrl.getPelicula);
//Crea una nueva película
router.post('/', peliculaCtrl.createPelicula);
//Actualiza una película por id
router.put('/:id', peliculaCtrl.updatePelicula);
//Elimina una película por id
router.delete('/:id', peliculaCtrl.deletePelicula);

module.exports = router;