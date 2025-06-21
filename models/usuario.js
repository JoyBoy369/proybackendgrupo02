const mongoose = require('mongoose');
const { Schema } = mongoose;
const UsuarioSchema = new Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    contrasenia: { type: String, required: true },
    rol: { type: String, required: true },
    fechaRegistro: { type: Date, default: Date.now, required: true }
})
module.exports = mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);