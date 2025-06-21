const Usuario = require('../models/usuario');
const usuarioCtrl = {}

usuarioCtrl.createUsuario = async (req, res) => {
    const existente = await Usuario.findOne({ email: req.body.email });
    if (existente) {
        return res.status(409).json({
            status: '0',
            msg: 'Ya existe un usuario con ese email.'
        })
    }
    var usuario = new Usuario(req.body);
    try {
        await usuario.save();
        res.json({
            'status': '1',
            'msg': 'Usuario guardado.'
        })
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando operacion.'
        })
    }
}

usuarioCtrl.registerUsuario = async (req, res) => {
    const existente = await Usuario.findOne({ email: req.body.email });
    if (existente) {
        return res.status(409).json({
            status: '0',
            msg: 'Ya existe un usuario con ese email.'
        })
    }
    const usuario = new Usuario({
        ...req.body,
        rol: 'Usuario'
    })
    try {
        await usuario.save();
        res.json({
            'status': '1',
            'msg': 'Usuario guardado.'
        })
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando operacion.'
        })
    }
}

usuarioCtrl.getUsuarios = async (req, res) => {
    var usuarios = await Usuario.find();
    res.json(usuarios);
}

usuarioCtrl.getUsuariosByRol = async (req, res) => {
    var usuarios = await Usuario.find({ rol: req.params.rol });
    res.json(usuarios);
}

usuarioCtrl.getUsuario = async (req, res) => {
    const usuario = await Usuario.findById(req.params.id);
    res.json(usuario);
}

usuarioCtrl.loginUsuario = async (req, res) => {
    const criteria = {
        email: req.body.email,
        contrasenia: req.body.contrasenia
    }
    try {
        const user = await Usuario.findOne(criteria);
        if (!user) {
            res.status(401).json({
                status: 0,
                msg: "Email o contraseña incorrectos."
            })
        } else {
            res.json({
                status: 1,
                msg: "Login exitoso.",
                userid: user._id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol
            })
        }
    } catch (error) {
        res.status(400).json({
            status: 0,
            msg: 'Error procesando la operacion.'
        })
    }
}

usuarioCtrl.editUsuario = async (req, res) => {
    try {
        await Usuario.updateOne({ _id: req.params.id }, req.body);
        res.json({
            'status': '1',
            'msg': 'Usuario actualizado.'
        })
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando la operacion.'
        })
    }
}

usuarioCtrl.deleteUsuario = async (req, res) => {
    try {
        await Usuario.deleteOne({ _id: req.params.id });
        res.json({
            status: '1',
            msg: 'Usuario removido.'
        })
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando la operacion.'
        })
    }
}

module.exports = usuarioCtrl;