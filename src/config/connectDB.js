const mongoose = require('mongoose');

exports.connectBD = async () => {
    try {
        await mongoose.connect('mongodb+srv://ANGIE:ANGIE@cluster0.etlm55z.mongodb.net/?retryWrites=true&w=majority')
        //await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
        console.log('Base de datos conectada')
    } catch (error) {
        console.log(error)
    }
}

