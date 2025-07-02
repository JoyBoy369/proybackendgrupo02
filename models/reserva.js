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
    qr: { type: String, required: false}
})
module.exports = mongoose.models.Reserva || mongoose.model('Reserva', ReservaSchema); 