const jwt = require('jsonwebtoken');
const authCtrl = {}
authCtrl.verifyToken = async (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(200).json({ 'status': '0', 'msg': 'Peticion no autorizada...' })
    } else {
        arrayTexto
        var arrayTexto = req.headers.authorization.split(' ');
        var token = null;
        (arrayTexto.length >= 2) ? token = arrayTexto[1] : token = null;
        if (token == null) {
            res.json({ 'status': '0', 'msg': 'Peticion no autorizada.' });
        } else {
            try {
                const payload = jwt.verify(token, "secretkey");
                req.userId = payload._id;
                next();
            } catch (error) {
                res.json({ 'status': '0', 'msg': 'Peticion no autorizada.' });
            }
        }
    }
}

module.exports = authCtrl;