const Pelicula = require('../models/pelicula');
const peliculaCtrl = {}

peliculaCtrl.getPeliculas = async (req, res) => {
    try {
        const peliculas = await Pelicula.find();
        res.json(peliculas);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error obteniendo las peliculas.'
        });
    }
}

peliculaCtrl.createPelicula = async (req, res) => {
    const existente = await Pelicula.findOne({ nombre: req.body.nombre });
    if (existente) {
        return res.status(409).json({
            status: '0',
            msg: 'La pelicula ya esta registrada.'
        })
    }
    var pelicula = new Pelicula(req.body);
    try {
        await pelicula.save();
        res.json({
            'status': '1',
            'msg': 'Pelicula guardada.'
        })
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error Guardando la pelicula.'
        })
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