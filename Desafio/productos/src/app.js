const express = require('express');
const ProductManager = require('./product_manager'); // Asegúrate de que la ruta sea correcta si el archivo está en otro directorio.
const productRoutes = require('./routers/productRoutes');
const cartRoutes = require('./routers/cartRoutes');

const app = express();
const port = 8080;

const productManager = new ProductManager('products.json'); // Suponiendo que el archivo de productos se llama 'products.json'

app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const products = await productManager.getProducts();
        
        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos.' });
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener producto.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

