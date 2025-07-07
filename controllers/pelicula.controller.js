const Pelicula = require('../models/pelicula');
const peliculaCtrl = {}

//  Obtiene todas las películas de la base de datos.
peliculaCtrl.getPeliculas = async (req, res) => {
    try {
        var peliculas = await Pelicula.find();
        res.json(peliculas);
    } catch (error) {
        console.error("Error al obtener las películas:", error); 
        res.status(500).json({
            'status': '0', 
            'msg': 'Error al obtener las películas.'
        });
    }
}

//Obtiene una película específica por su ID
peliculaCtrl.getPelicula = async (req, res) => {
    try {
        const pelicula = await Pelicula.findById(req.params.id);
        if (!pelicula) {
            return res.status(404).json({
                'status': '0',
                'msg': 'Película no encontrada.'
            });
        }
        res.json(pelicula);
    } catch (error) {
        console.error("Error al obtener la película por ID:", error);
        res.status(500).json({
            'status': '0',
            'msg': 'Error procesando la operación.'
        });
    }
}

// Crea una nueva película en la base de datos
peliculaCtrl.createPelicula = async (req, res) => {
    var pelicula = new Pelicula(req.body);
    try {
        // Antes de guardar, busca si ya existe una película con el mismo 'originalTitle'.
        const existingMovie = await Pelicula.findOne({ originalTitle: pelicula.originalTitle });

        // Si ya existe una película con ese título.
        if (existingMovie) {
            return res.status(409).json({
                'status': '0',
                'msg': 'Error: La película ya existe en la base de datos'
            });
        }

        // Si la película no existe, intenta guardarla en la base de datos.
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

//Actualiza una película existente en la base de datos.
peliculaCtrl.updatePelicula = async (req, res) => {
    const { id } = req.params;
    // Desestructura el cuerpo de la solicitud: excluye '_id' (ya que no se actualiza)
    // y el resto de los campos se guardan en 'updateData'.
    const { _id, ...updateData } = req.body;

    try {
        // Busca la película por su ID y la actualiza con los datos proporcionados.
        // { $set: updateData } asegura que solo los campos presentes en 'updateData' sean modificados.
        // { new: true } hace que Mongoose devuelva el documento _modificado_ en lugar del original.
        // { runValidators: true } asegura que las validaciones definidas en el esquema de Mongoose
        // se ejecuten sobre los datos de 'updateData' antes de guardar.
        const peliculaActualizada = await Pelicula.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        if (!peliculaActualizada) {
            return res.status(404).json({
                'status': '0',
                'msg': 'Película no encontrada para actualizar.'
            });
        }

        res.json({
            'status': '1',
            'msg': 'Película actualizada exitosamente.',
            'pelicula': peliculaActualizada
        });
    } catch (error) {
        console.error("Error al actualizar la película:", error);
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando la operación de actualización. Verifique los datos enviados.'
        });
    }
}

//Elimina una película de la base de datos por su ID
peliculaCtrl.deletePelicula = async (req, res) => {
    try {
        const peliculaEliminada = await Pelicula.findByIdAndDelete(req.params.id);
        if (!peliculaEliminada) {
            return res.status(404).json({
                'status': '0',
                'msg': 'Película no encontrada para eliminar.'
            });
        }
        res.json({
            status: '1',
            msg: '¡Película eliminada con éxito!'
        })
    } catch (error) {
        console.error("Error al eliminar la película:", error);
        res.status(500).json({
            'status': '0',
            'msg': 'Error al eliminar la película.'
        })
    }
}
module.exports = peliculaCtrl;