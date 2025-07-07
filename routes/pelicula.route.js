
const peliculaCtrl = require('./../controllers/pelicula.controller');

const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

//Obtiene las peliculas de la base de datos
router.get('/', peliculaCtrl.getPeliculas);
//Obtiene una película por id
router.get('/:id', peliculaCtrl.getPelicula);
//Crea una nueva película
router.post('/',authCtrl.verifyToken, peliculaCtrl.createPelicula);
//Actualiza una película por id
router.put('/:id',authCtrl.verifyToken, peliculaCtrl.updatePelicula);
//Elimina una película por id
router.delete('/:id',authCtrl.verifyToken, peliculaCtrl.deletePelicula);

module.exports = router;