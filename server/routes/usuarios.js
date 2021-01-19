const express = require('express')
const app = express();
const Usuario = require('../models/usuario');
const bcript = require('bcrypt');
const _ = require('underscore');


//Peticiones GET (OBTENER DATOS)
app.get('/usuario', function(req, res) {
    //funcion de la base de datos para buscar un registro
    let desde = req.query.desde || 0;
    desde = Number(desde)
    let limite = req.query.limite || 5;
    limite = Number(limite)

    //es la funcion que se trae los registros segun la condicion
    Usuario.find({ estado: true })


    //muestra los siguientes registros

    .skip(desde)

    //limite de registros traidos de la DB

    .limit(limite)

    //metodo que trae la info

    .exec((err, usuarios) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        Usuario.count({ estado: true }, (err, conteo) => {
            res.json({
                ok: true,
                usuarios,
                cuenta: conteo
            })
        })

    })
})

//PETICIONES POST (RECIBIR DATOS)

app.post('/usuario', (req, res) => {
    let body = req.body
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        //metodo de encriptacion de la contraseña
        password: bcript.hashSync(body.password, 10),
        role: body.role,
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})


//PETICIONES PUT(ACTUALIZAR UN REGISTRO)

app.put('/usuario/:id', function(req, res) {
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role']);
    let id = req.params.id;

    //funcion para recibir y actualizar un registro de la DB
    //comandos de mongoose
    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })


    })
})


//PETICIONES DELETE (ELIMINAR UN REGISTRO)

app.delete('/usuario/:id', function(req, res) {
    let cambiarEstado = {
        estado: false
    }
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'El usuario no fue encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })


    })



    //borrar un registro de forma fisica y permanente de la DB
    /*
        Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

            // if (err) {
            //     return res.status(400).json({
            //         ok: false,
            //         err
            //     });
            // }
            // if (!usuarioBorrado) {
            //     return res.status(400).json({
            //         ok: false,
            //         err: {
            //             msg: 'El usuario no fue encontrado'
            //         }
            //     })
            // }

            res.json({
                ok: true,
                usuario: usuarioBorrado
            })


        })
    */




});



module.exports = app