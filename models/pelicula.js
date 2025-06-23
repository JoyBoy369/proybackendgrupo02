const mongoose = require('mongoose');
const { Schema } = mongoose;
const PeliculaSchema = new Schema({
    nombre: { type: String, required: true },
    sinopsis: { type: String, required: true },
    duracion: { type: String, required: true },
    genero: { type: String, required: true },
    trailer: { type: String, required: true },
    imagen: { type: String, required: true },
    
})
module.exports = mongoose.models.Pelicula || mongoose.model('Pelicula', PeliculaSchema);