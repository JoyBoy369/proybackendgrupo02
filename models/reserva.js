const mongoose = require('mongoose');
const { Schema } = mongoose;
const Pelicula = require('./pelicula');
const funcion = require('./funcion');
const usuario = require('./usuario');

const ReservaSchema = new Schema({
    funcion: { type: Schema.Types.ObjectId, ref: funcion, required: true },
    precio: { type: Number, required: true },
    fecha: { type: Date, default: Date.now, required: true },
    hora: { type: String, required: true },
    usuario: { type: Schema.Types.ObjectId, ref: usuario, required: true },
    pagado: { type: Boolean, default: false, required: true },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false
});
module.exports = mongoose.models.Reserva || mongoose.model('Reserva', ReservaSchema);
