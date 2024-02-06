const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    code: {
        type: String,
        required: true,
        unique: true // Si se desea que el código del producto sea único
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        default: 0
    },
    category: String,
    thumbnails: [String],
});

module.exports = mongoose.model('products', productSchema);
