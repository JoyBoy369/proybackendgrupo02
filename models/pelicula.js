const mongoose = require('mongoose');
const { Schema } = mongoose;
const PeliculaSchema = new Schema({
    originalTitle: { type: String, required: true },
    description: { type: String, required: true },
    releaseDate: { type: String, required: true },
    trailer: { type: String, required: false },
    primaryImage: { type: String, required: false }
    })
module.exports = mongoose.models.Pelicula || mongoose.model('Pelicula', PeliculaSchema);