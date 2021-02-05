const mongoose = require('mongoose');
//validador de repeticion de datos del registro
const uniqueValidator = require('mongoose-unique-validator');

//esquema que define la forma y configuracion de los datos que entren
const Schema = mongoose.Schema;

//roles validos
let rolesValidos = {
    values: ['ADMIN', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

//formato del modelo
const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de usuario es necesario']
    },
    email: {
        type: String,
        required: [true, 'El correo electronico es necesario'],
        //no deja que se repita en el registro de la base de datos
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: false,
        default: 'USER_ROLE',
        //validacion de entradas permitidas
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true

    },
    google: {
        type: Boolean,
        default: false
    }

});

//eliminacion de la contraseña accediendo al metodo
usuarioSchema.methods.toJSON = function() {
        let user = this;
        let userObjet = user.toObject();
        delete userObjet.password;
        return userObjet;
    }
    //validacion con el unique de la repeticion del objeto

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' })


module.exports = mongoose.model('usuario', usuarioSchema);