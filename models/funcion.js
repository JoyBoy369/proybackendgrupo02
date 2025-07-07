const mongoose = require('mongoose');
const { Schema } = mongoose;
const Pelicula = require('./pelicula');

const FuncionSchema = new Schema({
    pelicula: { type: Schema.Types.ObjectId, ref: Pelicula, required: true },
    sala: { type: String, required: true },
    hora: { type: String, required: true },
    fecha: { type: Date, required: true },
    numeroButacas: { type: Number, required: true, default: 50 },

    // Campo para almacenar las butacas que ya han sido ocupadas.
    butacasOcupadas: {
        // Es un array de Strings, donde cada String podría representar el identificador de una butaca (ej. "A1", "B5").
        type: [String],
        default: [],
        validate: {
            // La función validator se ejecuta antes de guardar el documento.
            validator: function (arr) {
                // Crea un Set a partir del array para obtener solo los valores únicos.
                const uniqueButacas = new Set(arr);
                // Comprueba que todas las butacas en el array sean únicas
                // y que el número de butacas ocupadas no exceda el número total de butacas.
                return uniqueButacas.size === arr.length && arr.length <= this.numeroButacas;
            },
            message: 'Las butacas ocupadas deben ser únicas y no pueden exceder el número total de butacas.'
        },
    },

    // Valor por defecto es 1 pero lo cambié por ahora para probar los pagos.Tiene una validación para asegurar que el precio no sea negativo.
    precio: { type: Number, required: true, default: 1, min: [0, 'El precio no puede ser negativo.'] },
    // Campo para el estado actual de la función.
    estado: {
        type: String,
        required: true,
        enum: ['activa', 'completada', 'cancelada'],
        // El estado por defecto cuando se crea una nueva función es 'activa'.
        default: 'activa'
    }
}, {
    // Opciones del esquema:
    // 'toJSON: { virtuals: true }' y 'toObject: { virtuals: true }'
    // aseguran que los campos virtuales (como 'butacasDisponibles') se incluyan
    // cuando el documento se convierte a formato JSON o a un objeto JavaScript plano.
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    // 'id: false' evita que Mongoose cree un campo 'id' virtual adicional (además del '_id').
    id: false
});

// Define un índice en el campo 'fecha'.
// Esto mejora el rendimiento de las consultas que filtran o ordenan por fecha.
// '1' indica un orden ascendente.
FuncionSchema.index({ fecha: 1 });

// Define un campo virtual llamado 'butacasDisponibles'.
// Los campos virtuales no se almacenan directamente en la base de datos,
// sino que se calculan dinámicamente cada vez que se accede a ellos.
FuncionSchema.virtual('butacasDisponibles').get(function () {
    // Calcula las butacas disponibles restando el número de butacas ocupadas del total.
    return this.numeroButacas - this.butacasOcupadas.length;
});

module.exports = mongoose.models.Funcion || mongoose.model('Funcion', FuncionSchema);