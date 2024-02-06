const express = require('express');
const CartModel = require('../dao/models/cart.model'); 
const ProductModel = require('../dao/models/products.model');

const cartsRouter = express.Router();

// POST /api/carts/ - Crear un nuevo carrito
cartsRouter.post('/', async (req, res) => {
    try {
        const newCart = new CartModel({ user: req.body.userId, items: [] });
        const savedCart = await newCart.save();
        res.json(savedCart);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear carrito.');
    }
});

// GET /api/carts/:cid - Obtener un carrito por ID
cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid).populate('items.product');
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

// POST /api/carts/:cid/product/:pid - Agregar un producto al carrito
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid);
        if (!cart) {
            return res.status(404).send('Carrito no encontrado.');
        }
        
        const product = await ProductModel.findById(req.params.pid);
        if (!product) {
            return res.status(404).send('Producto no encontrado.');
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === req.params.pid);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += 1; // Incrementar la cantidad si el producto ya está en el carrito
        } else {
            cart.items.push({ product: req.params.pid, quantity: 1 }); // Agregar nuevo producto al carrito
        }

        await cart.save();
        res.status(200).send('Producto agregado al carrito.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar producto al carrito.');
    }
});

// DELETE /api/carts/:cid/product/:pid - Eliminar un producto del carrito
cartsRouter.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid);
        if (!cart) {
            return res.status(404).send('Carrito no encontrado.');
        }

        cart.items = cart.items.filter(item => item.product.toString() !== req.params.pid);

        await cart.save();
        res.status(200).send('Producto eliminado del carrito.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar producto del carrito.');
    }
});

module.exports = cartsRouter;