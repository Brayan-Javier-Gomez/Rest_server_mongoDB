const express = require('express')
const bodyParser = require('body-parser');
const app = express()
require('./config/config')

//Sirve para reconocer las peticiones post.
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Peticiones GET (OBTENER DATOS)
app.get('/usuario', function(req, res) {
    res.json('get usuario')
})

//PETICIONES POST (RECIBIR DATOS)

app.post('/usuario', function(req, res) {

    let body = req.body

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            msg: "El nombre es necesario"
        })
    } else {
        res.json({
            persona: body
        })
    }





})


//PETICIONES PUT(ACTUALIZAR UN REGISTRO)

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;

    res.json({
        id
    })

})


//PETICIONES DELETE (ELIMINAR UN REGISTRO)

app.delete('/usuario', function(req, res) {
    res.json('delete usuario')
})


//PUERTO USADO.

app.listen(process.env.PORT, () => {
    console.log(`Listening in port ${process.env.PORT}`);
})