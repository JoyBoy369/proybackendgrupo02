const Funcion = require('../models/funcion');
const funcionCtrl = {}

funcionCtrl.getFunciones = async (req, res) => {
    var funcions = await Funcion.find().populate('pelicula', 'originalTitle');  
    res.json(funcions);
}

funcionCtrl.createFuncion = async (req, res) => {
    var funcion = new Funcion(req.body);
    try {
        await funcion.save();
        res.json({
            'status': '1',
            'msg': 'Funcion guardada.'
        })
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando operacion.'
        })
    }
}

funcionCtrl.getFuncion = async (req, res) => {
    try {
        const funcion = await Funcion.findById(req.params.id).populate('pelicula', 'originalTitle');
        if (!funcion) {
            return res.status(404).json({
                status: '0',
                msg: 'Función no encontrada.'
            });
        }
        res.json(funcion);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error obteniendo la función.'
        });
    }
}

funcionCtrl.editFuncion = async (req, res) => {
    const { _id, ...updateData } = req.body; 
    try {
        const funcionActualizada = await Funcion.findByIdAndUpdate(
            _id,
            { $set: updateData },
            {
                new: true,
                runValidators: true
            }
        );
        if (!funcionActualizada) {
            return res.status(404).json({
                'status': '0',
                'msg': 'Función no encontrada para actualizar.'
            });
        }
        res.json({
            'status': '1',
            'msg': 'Función actualizada exitosamente.',
            'funcion': funcionActualizada
        });
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando la operación de actualización.'
        });
    }
}

funcionCtrl.deleteFuncion = async (req, res) => {
    try {
        const funcionEliminada = await Funcion.findByIdAndDelete(req.params.id);
        if (!funcionEliminada) {
            return res.status(404).json({
                status: '0',
                msg: 'Función no encontrada para eliminar.'
            });
        }
        res.json({
            status: '1',
            msg: 'Función eliminada.'
        });
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando la operación'
        });
    }
}

module.exports = funcionCtrl;