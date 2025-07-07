const funcionCtrl = require('./../controllers/funcion.controller');
const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

// Rutas para las funciones

//Trae todas las funciones(activas y completadas, la podemos usar para el admin)
router.get('/', funcionCtrl.getFunciones);
//Trae solo las funciones activas, las que se pueden reservar
router.get('/activas',funcionCtrl.getFuncionesActivas);
//Crea una función
router.post('/',authCtrl.verifyToken, funcionCtrl.createFuncion);
//Filtrar funciones por fecha mientras esten activas
router.get('/por-fecha/:fecha', funcionCtrl.getFuncionesPorFecha);
//Filtrar funciones por nombre de la película mientras esten activas
router.get('/pelicula/:nombrePelicula', funcionCtrl.getFuncionesPorNombrePelicula);
//Trae una función por id
router.get('/:id', funcionCtrl.getFuncion);
//Edita funciones (no la implementé en el front)
router.put('/:id',authCtrl.verifyToken, funcionCtrl.editFuncion);
//Elimina una función
router.delete('/:id',authCtrl.verifyToken, funcionCtrl.deleteFuncion);

//Ruta para probar que las funciones se archiven
// router.get('/prueba/probar-archivar-funciones', async (req, res) => {
//     console.log('Disparando manualmente archivePastFunciones...');
//     const result = await funcionCtrl.archivePastFunciones();
//     res.status(200).json(result);
// });


module.exports = router;