const mongoose = require('mongoose');
const { Schema } = mongoose;
const Funcion = require('./funcion')

const ReservaSchema = new Schema({
    usuario: {type: String, required: false},
    funcion: { type: Schema.Types.ObjectId, ref: Funcion, required: true },
    cantidadReservas: { type: Number, required: true},
    fecha: { type: Date, required: true },
    precioFinal: { type: Number, required: true },
    butacasReservadas: { type: [String], default: [] },
    imagen: { type: String, required: false },
    qr: { type: String, required: false},
    pagado: { type: String, required: true }
})

    //Agregué dos atributos: Pagado para saber si se pagó la reserva y el estado de la reserva. Y imagen para guardar la imagen del ticket
    //Podemos borrar el qr porque no lo usamos.
module.exports = mongoose.models.Reserva || mongoose.model('Reserva', ReservaSchema); 