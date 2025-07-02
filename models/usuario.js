const mongoose = require('mongoose');
const { Schema } = mongoose;
const UsuarioSchema = new Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    rol: { type: String, required: true },
    estado: { type: Boolean, default: true, required: true },
    fechaRegistro: { type: Date, default: Date.now, required: true }
})
module.exports = mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);