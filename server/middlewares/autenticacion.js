const jwt = require('jsonwebtoken');



/*
=========================
Autenticacion del token
=========================
*/

let autenticaToken = (req, res, next) => {

    // se trae los headers
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            res.status(401).json({
                ok: false,
                err: {
                    msg: 'El token no es valido',
                    err
                }
            })
        };

        req.usuario = decoded.usuario;

        console.log(req.usuario);

        next();
    })

}



/*
=========================
Autenticacion del Role
=========================
*/

let autenticaRole = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN') {
        next();
    } else {
        res.json({
            ok: false,
            err: {
                msg: 'El usuario no es admin'
            }

        })
    }



}

module.exports = {
    autenticaToken,
    autenticaRole
};