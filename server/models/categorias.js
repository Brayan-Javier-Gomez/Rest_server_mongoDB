const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'el nombre de la categoria es necesaria']
    },

})





module.exports = mongoose.model('categoria', categoriaSchema);