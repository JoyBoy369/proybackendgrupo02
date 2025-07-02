const express = require('express');
const peliculaCtrl = require('../controllers/pelicula.controller');
const router = express.Router();

router.post('/', peliculaCtrl.createPelicula);
router.get('/', peliculaCtrl.getPeliculas);
router.get('/:id', peliculaCtrl.getPelicula); 
router.put('/:id', peliculaCtrl.editPelicula);
router.delete('/:id', peliculaCtrl.deletePelicula);

module.exports = router;