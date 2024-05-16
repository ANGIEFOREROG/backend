const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const userSchema = new Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }, 
    isActive: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('users', userSchema);