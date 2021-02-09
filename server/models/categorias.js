const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'el nombre de la categoria es necesaria']
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'usuario' }
})





module.exports = mongoose.model('Categoria', categoriaSchema);