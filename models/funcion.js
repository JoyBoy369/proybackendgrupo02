const mongoose = require('mongoose');
const { Schema } = mongoose;
const Pelicula = require('./pelicula');

const FuncionSchema = new Schema({
    pelicula: { type: Schema.Types.ObjectId, ref: Pelicula, required: true },
    sala: { type: String, required: true },
    hora: { type: String, required: true },
    fecha: { type: Date, required: true },
    numeroButacas: { type: Number, required: true, default: 50 },

    butacasOcupadas: {
        type: [String],
        default: [],
        validate: {
            validator: function (arr) {
                const uniqueButacas = new Set(arr);
                return uniqueButacas.size === arr.length && arr.length <= this.numeroButacas;
            },
            message: props => `El número de butacas ocupadas (${props.value.length}) excede el total de butacas de la sala (${props.instance.numeroButacas}) o contiene duplicados.`
        },
    },

    precio: { type: Number, required: true, default: 5000, min: [0, 'El precio no puede ser negativo.'] },
    estado: {
        type: String,
        required: true,
        enum: ['activa', 'completada', 'cancelada'], 
        default: 'activa'
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false
});

FuncionSchema.index({ fecha: 1 });

FuncionSchema.virtual('butacasDisponibles').get(function () {
    return this.numeroButacas - this.butacasOcupadas.length;
});



module.exports = mongoose.models.Funcion || mongoose.model('Funcion', FuncionSchema);