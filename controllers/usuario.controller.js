const Usuario = require('../models/usuario');
const usuarioCtrl = {}
const { verifyGoogleToken } = require('../security/googleAuth');

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
    try {
        const { login, password } = req.body;  // login puede ser email o username

        // Buscar usuario por email o username y contraseña
        const user = await Usuario.findOne({
            $or: [
                { email: login },
                { username: login }
            ],
            password: password  // asegúrate que el campo en la DB sea password y no contrasenia
        });

        if (!user) {
            return res.status(401).json({
                status: 0,
                msg: "Email/username o contraseña incorrectos."
            });
        }

        // Login exitoso
        res.json({
            status: 1,
            msg: "Login exitoso.",
            userid: user._id,
            username: user.username,
            nombre: user.nombre,
            email: user.email,
            rol: user.rol
        });

    } catch (error) {
        res.status(400).json({
            status: 0,
            msg: 'Error procesando la operacion.'
        });
    }
};

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

usuarioCtrl.validarNuevoUsuario = async (req, res) => {
    try {
        const usuarioExistente = await Usuario.findOne({ email: req.body.email });
        if (usuarioExistente) {
            return res.json({ existe: true });
        }
        return res.json({ existe: false });
    } catch (error) {
        return res.status(500).json({
            status: '0',
            msg: 'Error validando el usuario.'
        });
    }
};

usuarioCtrl.googleLoginUsuario = async (req, res) => {
  const idToken = req.body.idToken;
  if (!idToken) {
    console.log('No ID token received in request body:', req.body);
    return res.status(400).json({ message: 'No ID token provided' });
  }
  try {
    const payload = await verifyGoogleToken(idToken);
    console.log('Payload del token verificado:', payload);
    // Aquí continua la lógica de login o registro con el payload
    res.json({ status: '1', msg: 'Login Google OK', user: payload });
  } catch (error) {
    console.error('Error verificando token Google:', error);
    return res.status(400).json({ message: 'Token verification failed', error });
  }
};

module.exports = usuarioCtrl;