const express = require('express');
const ProductModel = require('../dao/models/products.model');
const CartModel = require('../dao/models/cart.model'); // Asegúrate de que la ruta es correcta
const viewsRouter = express.Router();

// Ruta para visualizar todos los productos con paginación
viewsRouter.get('/products', async (req, res) => {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 2;

    try {
        const products = await ProductModel.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        const totalProducts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;

        res.render('products', {
            products,
            prevPage,
            nextPage,
            limit
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los productos');
    }
});

// Ruta para añadir un producto al carrito
viewsRouter.post('/cart/add', async (req, res) => {
    const { productId, quantity = 1, cartId } = req.body; // Asume una cantidad por defecto de 1 si no se proporciona

    try {
        let cart = await CartModel.findById(cartId);
        if (!cart) {
            // Si el carrito no existe, puedes decidir crear uno nuevo o manejar el error
            return res.status(404).send('Carrito no encontrado');
        }

        // Encuentra el producto por el ID para asegurar que existe
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }

        // Verifica si el producto ya existe en el carrito
        const productIndex = cart.items.findIndex(item => item.product.toString() === productId);
        
        if (productIndex > -1) {
            // Si el producto ya existe, actualiza la cantidad
            cart.items[productIndex].quantity += quantity;
        } else {
            // Si el producto no existe, lo añade al carrito
            cart.items.push({ product: productId, quantity });
        }

        // Guarda los cambios en el carrito
        await cart.save();
        res.redirect('/carts/' + cartId); // Redirige al usuario a la vista del carrito
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar el producto al carrito');
    }
});

// Ruta para visualizar un carrito específico con detalles
viewsRouter.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid).populate('items.product');
        if (cart) {
            // Usando la nueva vista 'cartDetails.handlebars' para mostrar los detalles del carrito
            res.render('cartDetails', { cart }); // Asegúrate de tener una plantilla 'cartDetails.handlebars'
        } else {
            res.status(404).send('Carrito no encontrado.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el carrito.');
    }
});

module.exports = viewsRouter;