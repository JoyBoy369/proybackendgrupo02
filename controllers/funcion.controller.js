const Funcion = require('../models/funcion');
const funcionCtrl = {};

funcionCtrl.getFunciones = async (req, res) => {
    try {
        var funciones = await Funcion.find().populate('pelicula');
        return res.status(200).json(funciones);
    } catch (error) {
        console.error("Error al obtener todas las funciones:", error);
        return res.status(500).json({
            'status': '0',
            'msg': 'Error al procesar la operación de obtención de todas las funciones.',
            'error': error.message
        });
    }
}

funcionCtrl.getFuncionesActivas = async (req, res) => {
    try {
        var funciones = await Funcion.find({ estado: 'activa' }).populate('pelicula');
        // Opción 1: Envía solo el array de funciones activas directamente
        return res.status(200).json(funciones);
    } catch (error) {
        console.error("Error al obtener funciones activas:", error);
        return res.status(500).json({
            'status': '0',
            'msg': 'Error al procesar la operación de obtención de funciones activas.',
            'error': error.message
        });
    }
}

funcionCtrl.createFuncion = async (req, res) => {
    const funcionData = { ...req.body, estado: 'activa' };
    var funcion = new Funcion(funcionData);
    try {
        await funcion.save();
        return res.status(201).json({
            'status': '1',
            'msg': 'Función guardada exitosamente.',
            'funcion': funcion 
        });
    } catch (error) {
        console.error("Error al guardar función en el backend:", error);
        let msg = 'Error procesando la operación.';
        if (error.name === 'ValidationError') {
            msg = `Error de validación: ${Object.values(error.errors).map(e => e.message).join(', ')}`;
        }
        return res.status(400).json({
            'status': '0',
            'msg': msg,
            'error': error.message
        });
    }
}

funcionCtrl.getFuncion = async (req, res) => {
    try {
        const funcion = await Funcion.findById(req.params.id).populate('pelicula');
        if (!funcion) {
            return res.status(404).json({ 'status': '0', 'msg': 'Función no encontrada.' });
        }
        return res.status(200).json(funcion);
    } catch (error) {
        console.error("Error al obtener la función:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                'status': '0',
                'msg': 'ID de función inválido.',
                'error': error.message
            });
        }
        return res.status(500).json({
            'status': '0',
            'msg': 'Error al procesar la operación de obtención de la función.',
            'error': error.message
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
        ).populate('pelicula');

        if (!funcionActualizada) {
            return res.status(404).json({
                'status': '0',
                'msg': 'Función no encontrada para actualizar.'
            });
        }

        return res.status(200).json({
            'status': '1',
            'msg': 'Función actualizada exitosamente.',
            'funcion': funcionActualizada
        });
    } catch (error) {
        console.error("Error al actualizar la función:", error);
        let msg = 'Error procesando la operación de actualización.';
        if (error.name === 'ValidationError') {
            msg = `Error de validación: ${Object.values(error.errors).map(e => e.message).join(', ')}`;
        } else if (error.name === 'CastError') {
            msg = 'ID de función inválido para la actualización.';
        }
        return res.status(400).json({
            'status': '0',
            'msg': msg,
            'error': error.message
        });
    }
}

funcionCtrl.deleteFuncion = async (req, res) => {
    try {
        const result = await Funcion.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ 'status': '0', 'msg': 'Función no encontrada para eliminar.' });
        }
        return res.status(200).json({ 
            status: '1',
            msg: 'Función eliminada exitosamente.'
        });
    } catch (error) {
        console.error("Error al eliminar la función:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                'status': '0',
                'msg': 'ID de función inválido para la eliminación.',
                'error': error.message
            });
        }
        return res.status(500).json({
            'status': '0',
            'msg': 'Error procesando la operación de eliminación.',
            'error': error.message
        });
    }
}

funcionCtrl.archivePastFunciones = async () => {
    try {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const result = await Funcion.updateMany(
            { fecha: { $lt: now }, estado: 'activa' },
            { $set: { estado: 'completada' } }
        );

        console.log(`[Tarea Programada] ${result.modifiedCount} funciones marcadas como 'completada'.`);
        return { status: '1', msg: `${result.modifiedCount} funciones archivadas.` };
    } catch (error) {
        console.error("[Tarea Programada] Error al archivar funciones pasadas:", error);
        return { status: '0', msg: 'Error al procesar el archivado de funciones.', error: error.message };
    }
};

module.exports = funcionCtrl;