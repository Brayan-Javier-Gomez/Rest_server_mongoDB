const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser');
const app = express();

require('./config/config')

//Sirve para reconocer las peticiones post.
app.use(bodyParser.urlencoded({ extended: false }))




// parse application/json
app.use(bodyParser.json())


//CONEXION CON LA BASE DE DATOS
app.use(require("./routes/usuarios"))

mongoose.connect('mongodb://localhost:27017/cafe', { useNewUrlParser: true, useUnifiedTopology: true }, (err, resp) => {

    if (err) throw err

    console.log('corriendo base de datos puerto 27017');

});


//PUERTO USADO.

app.listen(process.env.PORT, () => {
    console.log(`Listening in port ${process.env.PORT}`);
})