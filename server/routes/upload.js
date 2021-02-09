const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs');
const path = require('path')

const Usuario = require('../models/usuario')

app.use(fileUpload({ useTempFiles: true }))

app.put('/upload/:tipo/:id', (req, res) => {


    let tipo = req.params.tipo;
    let id = req.params.id;
    let archivo;
    let ruta;


    archivo = req.files.archivo;

    const tiposValidos = ['usuario', 'producto'];


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No se encontro ningun archivo'
        })
    }


    if (tiposValidos.indexOf(tipo) < 0) {
        return res.json({
            ok: false,
            err: {
                message: 'El tipo no es valido, por favor digite uno valido',
                validos: tiposValidos.join(', ')
            }
        })
    }
    /*
    Extenciones del archivo
    */
    let extencionesValidas = ['png', 'jpg', 'gif']
    let nombreArchivoSplit = archivo.name.split('.');
    let extencion = nombreArchivoSplit[nombreArchivoSplit.length - 1]

    if (extencionesValidas.indexOf(extencion) < 0) {
        return res.json({
            ok: false,
            err: {
                message: 'El archivo no tiene una extencion valida',
                extenciones: 'las extenciones permitidas son: ' + extencionesValidas.join(', ')
            }
        })
    }

    let nameFile = `${id}-${new Date().getMilliseconds()}.${extencion}`
    ruta = `uploads/${tipo}/${nameFile}`;

    archivo.mv(ruta, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        imagenUsuario(id, res, nameFile);

    })



    function imagenUsuario(id, res, nameFile) {
        Usuario.findById(id, (err, usuarioDB) => {
            if (err) {
                borrarImagen('usuario', nameFile)
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!usuarioDB) {
                borrarImagen('usuario', nameFile)
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El usuario no fue encontardo'
                    }
                })
            }

            borrarImagen('usuario', usuarioDB.img)

            usuarioDB.img = nameFile;

            usuarioDB.save((err, usuarioDB) => {

                res.json({
                    ok: true,
                    message: 'la imagen se guardo correctamente ',
                    usuario: usuarioDB,
                    img: nameFile
                })

            })



        });


    }

    function borrarImagen(tipo, nombreImagen) {
        let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`)

        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }

    }




})

module.exports = app;