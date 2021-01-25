//CONFIGURA EL PUERTO DEL SERVIDOR QUE VA A USAR LA APLICACION DEPENDIENDO DEL 
//PUERTO QUE OFREZCA EL HOSTING 
/*
===============================
Puerto
===============================
*/

process.env.PORT = process.env.PORT || 3000;

/*
===============================
Entorno
===============================
*/

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/*
===============================
Base De Datos
===============================
*/
let urlDB;

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe';


} else {
    urlDB = 'mongodb+srv://bryan_gomez:Brayangomez1986@cluster0.ievef.mongodb.net/cafe';
}


process.env.URLDB = urlDB;

/*
===============================
Fecha de expiracion del token
===============================
*/
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24;

/*
===============================
Clave del token
===============================
*/

process.env.SEED = process.env.SEED || 'clave_de_desarrollo';