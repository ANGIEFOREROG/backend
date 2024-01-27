const express = require('express');
const CartManager = require('../cartManager');
const cartManager = new CartManager('carts.json');

const cartsRouter = express.Router();

// POST /api/carts/
cartsRouter.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear carrito.');
    }
});

// GET /api/carts/:cid
cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).send('Carrito no encontrado.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener carrito.');
    }
});

// POST /api/carts/:cid/product/:pid
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);

        const updatedCart = await cartManager.addOrUpdateProduct(cartId, productId);
        
        if (updatedCart) {
            res.json(updatedCart);
        } else {
            res.status(404).send('Carrito no encontrado o producto no agregado.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar producto al carrito.');
    }
});

// DELETE /api/carts/:cid/product/:pid
cartsRouter.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar producto del carrito.');
    }
});

module.exports = cartsRouter;