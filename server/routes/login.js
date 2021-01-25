const express = require('express');

const app = express();

const bcript = require('bcrypt');

const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');

const jwt = require('jsonwebtoken');

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










module.exports = app