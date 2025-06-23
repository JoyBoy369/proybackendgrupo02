const mongoose = require('mongoose');
const { Schema } = mongoose;
const PeliculaSchema = new Schema({
    id: { type: String, required: true },
    originalTitle: { type: String, required: true },
    description: { type: String, required: true },
    releaseDate: { type: String, required: true },
    trailer: { type: String, required: true },
    primaryImage: { type: String, required: true }
    })
module.exports = mongoose.models.Pelicula || mongoose.model('Pelicula', PeliculaSchema);