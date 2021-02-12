const express = require('express');
const app = express();
const { autenticaToken, autenticaRole } = require('../middlewares/autenticacion');

const ModelCategoria = require('../models/categorias');


/*
============================
Obtener Todas las categorias
============================
*/
// 
app.get('/categoria', autenticaToken, function(req, res) {
    ModelCategoria.find({})
        //metodo para ordenar la lista    
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: 'Error desconocido'
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
        nombre: body.nombre,
        usuario: req.usuario._id,
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
            categoria: categoriaDB,

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
    let body = req.body;



    ModelCategoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {

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

app.delete('/categoria/:id', [autenticaToken, autenticaRole], (req, res) => {
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
            categoria: categoriaBorrada,
            msg: 'La categoria fue borrada'
        })



    })



});

module.exports = app;