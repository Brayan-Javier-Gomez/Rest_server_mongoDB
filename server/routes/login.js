const express = require('express');

const app = express();

const bcript = require('bcrypt');

const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');

const jwt = require('jsonwebtoken');
//verificacion del token de google
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.CLIENT_ID);

app.post('/login', (req, res) => {
    let body = req.body;



    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        msg: 'Usuario o contraseña incorrectos',
                        err
                    }
                })
            }

            if (bcript.compareSync(body.password, usuarioDB.password) === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        msg: 'UsuariO o contraseña incorrectos',
                        err
                    }
                })
            }

            //  process.env.CADUCIDAD_TOKEN

            let token = jwt.sign({
                usuario: usuarioDB
            }, process.env.SEED, { expiresIn: 60 * 60 * 24 * 30 * 12 })


            res.json({
                ok: true,
                usuario: usuarioDB,
                token: token
            })


        }

    )

})


// configuraciones de google sign



async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const payload = ticket.getPayload();


    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}



app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            })
        })


    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return status(500).json({
                ok: true,
                err
            })
        };
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return status(400).json({
                    ok: true,
                    err: {
                        msg: 'El usuario ya ha sido creado, por favor entre con su usuario.'
                    }
                })
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: 60 * 60 * 24 * 30 * 12 })



                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }


        } else {
            let usuario = new Usuario;

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ":')"

            usuario.save((err, usuarioDB) => {

                if (err) {
                    return status(500).json({
                        ok: true,
                        err
                    })
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: 60 * 60 * 24 * 30 * 12 })



                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })


            })
        }



    })


})















module.exports = app