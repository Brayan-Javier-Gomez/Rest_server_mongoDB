const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'el nombre de la categoria es necesaria']
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' },

})





module.exports = mongoose.model('categoria', categoriaSchema);