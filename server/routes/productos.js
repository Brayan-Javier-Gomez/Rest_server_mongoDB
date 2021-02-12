const express = require('express');
let app = express();

const { autenticaToken, autenticaRole } = require('../middlewares/autenticacion');
let ModelProducto = require('../models/producto');



app.get('/producto', autenticaToken, (req, res) => {
    ModelProducto.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .skip(0)
        .limit(10)
        // .populate('categoria')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (!productos) {
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'No se encontro ningun producto'
                    }
                })
            }

            res.json({
                ok: true,
                productos
            })
        })
});

app.get('/producto/:id', autenticaToken, (req, res) => {

    let id = req.params.id;
    ModelProducto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        };
        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'No se ha encontrado el producto'
                }
            })
        };

        res.json({
            ok: true,
            producto: productoDB
        })


    })
});


app.post('/producto', [autenticaToken, autenticaRole], (req, res) => {
    let body = req.body;

    let producto = new ModelProducto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        disponible: body.disponible,
        usuario: req.usuario._id,
        categoria: req.usuario._id

    })

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        };
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                msg: 'ha ocurrido un error'
            })
        };
        res.json({
            ok: true,
            producto: productoDB
        })
    })

});


app.put('/produto/:id', [autenticaToken, autenticaRole], (req, res) => {

});


app.delete('/producto/: id ', [autenticaToken, autenticaRole], (req, res) => {
    //cambiar disponibilidad
})




module.exports = app;