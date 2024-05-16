const MessageModel = require('../models/messages.model');

class MessagesManagerMongo {
    // Crear un nuevo mensaje
    async createMessage(userData, messageText) {
        const message = new MessageModel({
            user: userData,
            message: messageText
        });
        return await message.save();
    }

    // Leer todos los mensajes
    async getAllMessages() {
        return await MessageModel.find({}).sort({ createdAt: 1 }); // Puede que quieras limitar y paginar
    }

    // Leer un mensaje por ID
    async getMessageById(messageId) {
        return await MessageModel.findById(messageId);
    }

    // Actualizar un mensaje por ID
    async updateMessage(messageId, messageText) {
        return await MessageModel.findByIdAndUpdate(
            messageId,
            { message: messageText },
            { new: true }
        );
    }

    // Eliminar un mensaje por ID
    async deleteMessage(messageId) {
        return await MessageModel.findByIdAndDelete(messageId);
    }
}

module.exports = MessagesManagerMongo;