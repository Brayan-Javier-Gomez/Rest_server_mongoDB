const express = require('express');
const app = express();
const { autenticaToken } = require('../middlewares/autenticacion');

const ModelCategoria = require('../models/categorias');


/*
============================
Obtener Todas las categorias
============================
*/
app.get('/categoria', autenticaToken, (req, res) => {
    console.log('peticion get');
    ModelCategoria.find({})
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            ModelCategoria.count((err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cuenta: conteo
                })
            })
        })
});



/*
============================
Obtener una categoria por id
============================
*/
app.get('/categoria/:id', autenticaToken, (req, res) => {


    let id = req.params.id;

    ModelCategoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })

        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })


});



/*
============================
Crear una nueva categoria
============================
*/

app.post('/categoria', autenticaToken, (req, res) => {

    //obtiene la entrada del usuario
    let body = req.body;
    let categoria = new ModelCategoria({
        //objetos que se mandan a la base de datos
        nombre: body.nombre
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })


    })

});



/*
============================================
Actualizar una categoria, se requiere el id
============================================
*/
app.put('/categoria/:id', autenticaToken, (req, res) => {

    let id = req.params.id;



    ModelCategoria.findByIdAndUpdate(id, { new: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })





});


/*
============================
Eliminar las categorias
============================
*/

app.delete('/categoria/:id', autenticaToken, (req, res) => {
    let id = req.params.id;
    ModelCategoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'La categoria no existe'
                }
            })
        }


        res.json({
            ok: true,
            categoria: categoriaBorrada
        })



    })



});

module.exports = app;