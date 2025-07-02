const Reserva = require('../models/reserva');
const Funcion = require('../models/funcion');
const reservaCtrl = {};

reservaCtrl.getReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find().populate('funcion');
        res.json(reservas);
    } catch (error) {
        console.error("Error al obtener las reservas:", error);
        res.status(500).json({
            'status': '0',
            'msg': 'Error al obtener las reservas.'
        });
    }
};

reservaCtrl.getReserva = async (req, res) => {
    const { id } = req.params;
    try {
        let reserva;
        reserva = await Reserva.findById(id).populate('funcion');

        // reserva = await Reserva.findOne({ usuario: id }).populate('funcion'); 
        if (!reserva) {
            return res.status(404).json({
                'status': '0',
                'msg': 'Reserva no encontrada.'
            });
        }
        res.json(reserva);
    } catch (error) {
        console.error("Error al obtener la reserva:", error);
        res.status(500).json({
            'status': '0',
            'msg': 'Error procesando la operación.'
        });
    }
};

reservaCtrl.createReserva = async (req, res) => {
    const { usuario, funcion, cantidadReservas, fecha, precioFinal, butacasReservadas, qr } = req.body;

    try {
        const funcionExistente = await Funcion.findById(funcion);
        if (!funcionExistente) {
            return res.status(404).json({
                'status': '0',
                'msg': 'La función especificada no existe.'
            });
        }

        if (butacasReservadas.length !== cantidadReservas) {
            return res.status(400).json({
                'status': '0',
                'msg': 'La cantidad de butacas seleccionadas no coincide con la cantidad total de reservas.'
            });
        }

        const butacasOcupadas = funcionExistente.butacasOcupadas || [];
        const butacasSolapadas = butacasReservadas.filter(butaca => butacasOcupadas.includes(butaca));
        if (butacasSolapadas.length > 0) {
            return res.status(400).json({
                'status': '0',
                'msg': `Las butacas ${butacasSolapadas.join(', ')} ya están reservadas.`,
            });
        }
        const nuevaReserva = new Reserva(req.body);
        await nuevaReserva.save();

        if (funcionExistente.butacasOcupadas) {
            funcionExistente.butacasOcupadas.push(...butacasReservadas);
            await funcionExistente.save();
        }

        res.status(201).json({
            'status': '1',
            'msg': 'Reserva creada exitosamente.',
            'reserva': nuevaReserva
        });
    } catch (error) {
        console.error("Error al crear la reserva:", error);
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando la operación. Verifique los datos enviados.'
        });
    }
};

reservaCtrl.editReserva = async (req, res) => {
    const { id } = req.params;
    const { _id, ...updateData } = req.body;

    try {
        const reservaActualizada = await Reserva.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!reservaActualizada) {
            return res.status(404).json({
                'status': '0',
                'msg': 'Reserva no encontrada para actualizar.'
            });
        }

        res.json({
            'status': '1',
            'msg': 'Reserva actualizada exitosamente.',
            'reserva': reservaActualizada
        });
    } catch (error) {
        console.error("Error al actualizar la reserva:", error);
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando la operación de actualización.'
        });
    }
};

reservaCtrl.deleteReserva = async (req, res) => {
    try {
        const reservaEliminada = await Reserva.findByIdAndDelete(req.params.id);

        if (!reservaEliminada) {
            return res.status(404).json({
                'status': '0',
                'msg': 'Reserva no encontrada para eliminar.'
            });
        }

        const funcionAsociada = await Funcion.findById(reservaEliminada.funcion);
        if (funcionAsociada) {
            funcionAsociada.butacasOcupadas = funcionAsociada.butacasOcupadas.filter(
                butaca => !reservaEliminada.butacasReservadas.includes(butaca)
            );
            await funcionAsociada.save();
        }

        res.json({
            status: '1',
            msg: '¡Reserva eliminada con éxito!',
            reserva: reservaEliminada
        });
    } catch (error) {
        console.error("Error al eliminar la reserva:", error);
        res.status(500).json({
            'status': '0',
            'msg': 'Error al eliminar la reserva.'
        });
    }
};

module.exports = reservaCtrl;