const mongoose = require('mongoose');
const { Schema } = mongoose;
const Pelicula = require('./pelicula');

const FuncionSchema = new Schema({
    idFuncion: { type: String, required: true },
    pelicula: { type: Schema.Types.ObjectId, ref: Pelicula, required: true },
    sala: { type: String, required: true },
    hora: { type: String, required: true },
    numeroButacas: { type: Number, required: true },
    butacasOcupadas: { type: [String], default: [] },
    precio: { type: Number, required: true },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false
});

FuncionSchema.virtual('butacasDisponibles').get(function () {
    return this.numeroButacas - this.butacasOcupadas.length;
});



module.exports = mongoose.models.Funcion || mongoose.model('Funcion', FuncionSchema);