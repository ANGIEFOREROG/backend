const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Esto agregará automáticamente los campos `createdAt` y `updatedAt`
});

module.exports = mongoose.model('messages', messageSchema);