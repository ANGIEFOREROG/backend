const express = require('express');
const fs = require('fs').promises;
const { body, validationResult } = require('express-validator');

const productsRouter = express.Router();

// Función para obtener el siguiente ID único
let currentProductId = 1; // Puedes inicializar este valor con el último ID leído del archivo o con cualquier otra lógica que prefieras.

const getNextProductId = async () => {
    // Aquí, en un escenario real, deberías leer el archivo y determinar el próximo ID disponible.
    return currentProductId++;
};

// GET /api/products/
productsRouter.get('/', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const products = JSON.parse(await fs.readFile('products.json', 'utf8'));

        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (error) {
        res.status(500).send('Error al obtener productos.');
    }
});

// GET /api/products/:pid
productsRouter.get('/:pid', async (req, res) => {
    try {
        const products = JSON.parse(await fs.readFile('products.json', 'utf8'));
        const product = products.find(p => p.id === parseInt(req.params.pid));

        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Producto no encontrado.');
        }
    } catch (error) {
        res.status(500).send('Error al obtener producto.');
    }
});

// Validaciones para POST /api/products/
const validateProduct = [
    body('title').notEmpty().withMessage('El título es requerido.'),
    body('description').notEmpty().withMessage('La descripción es requerida.'),
    body('code').notEmpty().withMessage('El código es requerido.'),
    body('price').notEmpty().withMessage('El precio es requerido.').isNumeric().withMessage('El precio debe ser numérico.'),
    body('stock').notEmpty().withMessage('El stock es requerido.').isNumeric().withMessage('El stock debe ser numérico.'),
    // Agrega las validaciones necesarias para los demás campos requeridos
];

// POST /api/products/
productsRouter.post('/', validateProduct, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const products = JSON.parse(await fs.readFile('products.json', 'utf8'));

        // Obtener el último ID y generar el nuevo ID
        const lastProduct = products[products.length - 1];
        const newId = lastProduct ? lastProduct.id + 1 : 1;

        const newProduct = {
            id: newId,
            title: req.body.title,
            description: req.body.description,
            code: req.body.code,
            price: req.body.price,
            status: true,  // Valor por defecto
            stock: req.body.stock,
            category: req.body.category,
            thumbnails: req.body.thumbnails || []
        };

        products.push(newProduct);

        await fs.writeFile('products.json', JSON.stringify(products, null, 2));
        res.json(newProduct);
    } catch (error) {
        console.error(error);  // Imprime el error en la consola para diagnosticar
        res.status(500).send('Error al agregar producto.');
    }
});

// PUT /api/products/:pid
productsRouter.put('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const products = JSON.parse(await fs.readFile('products.json', 'utf8'));
        const index = products.findIndex(p => p.id === productId);

        if (index !== -1) {
            products[index] = {
                id: productId,
                title: req.body.title,
                description: req.body.description,
                code: req.body.code,
                price: req.body.price,
                status: req.body.status !== undefined ? req.body.status : true,
                stock: req.body.stock,
                category: req.body.category,
                thumbnails: req.body.thumbnails || []
            };

            await fs.writeFile('products.json', JSON.stringify(products, null, 2));
            res.json(products[index]);
        } else {
            res.status(404).send('Producto no encontrado.');
        }
    } catch (error) {
        res.status(500).send('Error al actualizar producto.');
    }
});


// DELETE /api/products/:pid
productsRouter.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        let products = JSON.parse(await fs.readFile('products.json', 'utf8'));
        const initialLength = products.length;

        products = products.filter(p => p.id !== productId);

        if (products.length < initialLength) {
            await fs.writeFile('products.json', JSON.stringify(products, null, 2));
            res.status(204).send();
        } else {
            res.status(404).send('Producto no encontrado.');
        }
    } catch (error) {
        res.status(500).send('Error al eliminar producto.');
    }
});

module.exports = productsRouter;