const Funcion = require('../models/funcion');
const Pelicula = require('../models/pelicula');
const funcionCtrl = {};

//Obtiene todas las funciones de cine de la base de datos.

funcionCtrl.getFunciones = async (req, res) => {
    try {
        // .populate('pelicula') reemplaza el ID de la película por el documento completo de la película asociada.
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

//Obtiene solo las funciones de cine que están en estado 'activa'.

funcionCtrl.getFuncionesActivas = async (req, res) => {
    try {
        // Busca funciones donde el campo 'estado' sea 'activa'.
        // También populariza la información de la película.
        var funciones = await Funcion.find({ estado: 'activa' }).populate('pelicula');
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

//  Crea una nueva función de cine en la base de datos
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
        return res.status(400).json({
            'status': '0',
            'msg': msg,
            'error': error.message
        });
    }
}

//Obtiene una función de cine específica por su ID.
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

// Obtiene funciones activas basándose en el nombre de la película.

funcionCtrl.getFuncionesPorNombrePelicula = async (req, res) => {
    try {
        const { nombrePelicula } = req.params;

        // Verifica si el parámetro nombrePelicula fue proporcionado.
        if (!nombrePelicula) {
            return res.status(400).json({
                'status': '0',
                'msg': 'Parámetro "nombrePelicula" es requerido.'
            });
        }

        // Busca películas cuyo 'originalTitle' contenga el 'nombrePelicula' (insensible a mayúsculas/minúsculas).
        const peliculas = await Pelicula.find({
            originalTitle: { $regex: nombrePelicula, $options: 'i' } // $regex para búsqueda de patrones, $options: 'i' para ignorar caso.
        });

        if (peliculas.length === 0) {
            return res.status(200).json({
                'status': '1',
                'msg': 'No se encontraron películas con ese nombre, por lo tanto no hay funciones asociadas.',
                'funciones': []
            });
        }

        // Extrae los IDs de las películas encontradas.
        const peliculaIds = peliculas.map(pelicula => pelicula._id);

        // Busca funciones que estén asociadas a cualquiera de esos IDs de película
        // y que además estén en estado 'activa'.
        const funciones = await Funcion.find({
            pelicula: { $in: peliculaIds }, // $in busca documentos cuyo campo 'pelicula' esté en el array 'peliculaIds'.
            estado: 'activa'
        }).populate('pelicula');

        // Si no se encuentran funciones activas para las películas encontradas.
        if (funciones.length === 0) {
            return res.status(200).json({
                // Devuelve un 200 (OK) con un mensaje informativo y un array vacío.
                'status': '1',
                'msg': 'No se encontraron funciones activas para las películas con el nombre especificado.',
                'funciones': []
            });
        }
        return res.status(200).json(funciones);

    } catch (error) {
        console.error("Error al obtener funciones por nombre de película:", error);
        return res.status(500).json({
            'status': '0',
            'msg': 'Error al procesar la operación de obtención de funciones por nombre de película.',
            'error': error.message
        });
    }
};

// Obtiene funciones activas programadas para una fecha específica.
funcionCtrl.getFuncionesPorFecha = async (req, res) => {
    try {
        const { fecha } = req.params;
        // Verifica si el parámetro 'fecha' fue proporcionado.
        if (!fecha) {
            return res.status(400).json({
                'status': '0',
                'msg': 'El parámetro "fecha" es requerido. Formato esperado: AAAA-MM-DD.'
            });
        }

        // Crea un objeto Date para el inicio del día de la fecha proporcionada (UTC).
        const searchDate = new Date(fecha);
        searchDate.setUTCHours(0, 0, 0, 0); // Establece la hora a medianoche UTC para un día completo.

        // Crea un objeto Date para el inicio del día siguiente a la fecha proporcionada.
        const nextDay = new Date(searchDate);
        nextDay.setUTCDate(searchDate.getUTCDate() + 1); // Suma un día.

        // Construye la consulta para encontrar funciones dentro del rango de la fecha y que estén activas.
        const query = {
            fecha: {
                $gte: searchDate, // Mayor o igual que la fecha de inicio.
                $lt: nextDay     // Menor que la fecha del día siguiente (para incluir todo el día).
            },
            estado: 'activa'
        };

        // Ejecuta la consulta y populariza la información de la película.
        const funciones = await Funcion.find(query).populate('pelicula');

        // Si no se encuentran funciones para la fecha.
        if (funciones.length === 0) {
            // Devuelve un 200 (OK) con un mensaje informativo y un array vacío.
            return res.status(200).json({
                'status': '1',
                'msg': `No se encontraron funciones activas para la fecha ${fecha}.`,
                'funciones': []
            });
        }

        // Si se encuentran funciones, las devuelve.
        return res.status(200).json(funciones);

    } catch (error) {
        console.error("Error al obtener funciones por fecha:", error);
        if (error.name === 'CastError' || error.name === 'Invalid Date') {
            return res.status(400).json({
                'status': '0',
                'msg': 'Formato de fecha inválido. Utilice AAAA-MM-DD.',
                'error': error.message
            });
        }
        return res.status(500).json({
            'status': '0',
            'msg': 'Error al procesar la operación de obtención de funciones por fecha.',
            'error': error.message
        });
    }
};

// Actualiza una función de cine existente por su ID(no implementado en el frontend)
funcionCtrl.editFuncion = async (req, res) => {
    // Desestructura el _id del cuerpo de la solicitud y el resto de los datos se guardan en 'updateData'.
    const { _id, ...updateData } = req.body;

    try {
        // Busca una función por su _id y la actualiza.
        // { $set: updateData } indica qué campos actualizar.
        // { new: true } devuelve el documento actualizado en lugar del original.
        // { runValidators: true } asegura que las validaciones del esquema se ejecuten durante la actualización.
        var funcionActualizada = await Funcion.findByIdAndUpdate(
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

// Elimina una función de cine por su ID
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

// Metodo para archivar funciones pasadas. Marca como 'completada' las funciones activas cuya fecha ya ha pasado. Diseñada para ser una tarea programada (usando cron).

funcionCtrl.archivePastFunciones = async () => {
    try {
        // Obtiene la fecha y hora actual y la normaliza a medianoche UTC para la comparación.
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Establece la hora a 00:00:00 para comparar solo la fecha.

        // Actualiza múltiples documentos:
        // Busca funciones donde la 'fecha' sea anterior al día de hoy ($lt: now)
        // y cuyo 'estado' actual sea 'activa'.
        // Cambia el 'estado' de esas funciones a 'completada'.
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