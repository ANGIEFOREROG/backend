const CartModel = require('../models/cart.model');

class CartManagerMongo {
    async createCart(userId) {
        const newCart = new CartModel({ user: userId, items: [] });
        return await newCart.save();
    }

    async getCart(cartId) {
        return await CartModel.findById(cartId).populate('items.product');
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const productIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (productIndex >= 0) {
            cart.items[productIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        return await cart.save();
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        return await cart.save();
    }
}

module.exports = CartManagerMongo;
