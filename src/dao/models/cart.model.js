const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users', // Modelo de usuario
        required: true
    },
    items: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'products', // Modelo de producto
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'La cantidad debe ser al menos 1'],
            default: 1
        }
    }],
    status: {
        type: String,
        enum: ['active', 'checkout', 'paid'],
        default: 'active'
    }
}, {
    timestamps: true // Para añadir automáticamente campos de createdAt y updatedAt
});

module.exports = mongoose.model('carts', cartSchema);
