// cartRoutes.js
const express = require('express');

const cartsManager = require('../cartManager');

const cartsRouter = express.Router();

// POST /api/carts/
cartsRouter.post('/', async (req, res) => {
    try {
        const carts = await cartsManager.readCartsFile();

        const newCart = {
            id: cartsManager.generateCartId(carts),
            products: []
        };

        carts.push(newCart);
        await cartsManager.writeCartsFile(carts);

        res.json(newCart);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear carrito.');
    }
});

// GET /api/carts/:cid
cartsRouter.get('/:cid', async (req, res) => {
    try {
        const carts = await cartsManager.readCartsFile();
        const cart = carts.find(c => c.id === parseInt(req.params.cid));

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
        const carts = await cartsManager.readCartsFile();
        const cart = carts.find(c => c.id === parseInt(req.params.cid));

        if (cart) {
            const productId = parseInt(req.params.pid);
            const existingProduct = cart.products.find(p => p.id === productId);

            if (existingProduct) {
                // Si el producto ya existe, incrementamos la cantidad
                existingProduct.quantity += 1;
            } else {
                // Si el producto no existe, lo agregamos al carrito cd 1
                cart.products.push({
                    id: productId,
                    quantity: 1
                });
            }

            await cartsManager.writeCartsFile(carts);
            res.json(cart);
        } else {
            res.status(404).send('Carrito no encontrado.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar producto al carrito.');
    }
});

// DELETE /api/carts/:cid/product/:pid
cartsRouter.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const carts = await cartsManager.readCartsFile();
        const cart = carts.find(c => c.id === parseInt(req.params.cid));

        if (cart) {
            const index = cart.products.findIndex(p => p.id === parseInt(req.params.pid));
            if (index !== -1) {
                cart.products.splice(index, 1);
                await cartsManager.writeCartsFile(carts);
            }
            res.json(cart);
        } else {
            res.status(404).send('Carrito no encontrado.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar producto del carrito.');
    }
});

module.exports = cartsRouter;
