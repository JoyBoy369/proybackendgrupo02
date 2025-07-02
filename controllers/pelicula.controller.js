const Pelicula = require('../models/pelicula');
const peliculaCtrl = {}

peliculaCtrl.getPeliculas = async (req, res) => {
    try {
        const peliculas = await Pelicula.find();
        res.json(peliculas);
    } catch (error) {
        res.status(500).json({
            status: '0',
            msg: 'Error obteniendo las peliculas.'
        });
    }
}

peliculaCtrl.getPelicula = async (req, res) => {
    const pelicula = await Pelicula.findById(req.params.id);
    res.json(pelicula);
}

peliculaCtrl.createPelicula = async (req, res) => {
     var pelicula = new Pelicula(req.body);
    try {
        
        const existingMovie = await Pelicula.findOne({ _id: pelicula._id });

        if (existingMovie) {
            return res.status(409).json({
                'status': '0',
                'msg': 'Error: La película ya existe en la base de datos'
            });
        }

        await pelicula.save();
        res.status(201).json({
            'status': '1',
            'msg': 'Película guardada con éxito'
        });
    } catch (error) {
        console.error("Error al crear película:", error); 
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando la operación. Verifique los datos enviados.'
        });
    }
}

peliculaCtrl.editPelicula = async (req, res) => {
    try {
        await Pelicula.updateOne({ _id: req.params.id }, req.body);
        res.json({
            'status': '1',
            'msg': 'Pelicula actualizada.'
        })
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando la operacion.'
        })
    }
}

peliculaCtrl.deletePelicula = async (req, res) => {
    try {
        await Pelicula.deleteOne({ _id: req.params.id });
        res.json({
            status: '1',
            msg: 'Pelicula removida.'
        })
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando la operacion.'
        })
    }
}

module.exports = peliculaCtrl;