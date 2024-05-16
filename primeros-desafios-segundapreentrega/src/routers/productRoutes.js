const express = require('express');
const { body, validationResult } = require('express-validator');
const ProductModel = require('../dao/models/products.model');

const productsRouter = express.Router();

// Validaciones para POST /api/products/
const validateProduct = [
    body('title').notEmpty().withMessage('El título es requerido.'),
    body('description').notEmpty().withMessage('La descripción es requerida.'),
    body('code').notEmpty().withMessage('El código es requerido.'),
    body('price').notEmpty().withMessage('El precio es requerido.').isNumeric().withMessage('El precio debe ser numérico.'),
    body('stock').notEmpty().withMessage('El stock es requerido.').isNumeric().withMessage('El stock debe ser numérico.'),
    body('category').notEmpty().withMessage('La categoria es requerida.'),
    body('thumbnails').notEmpty().withMessage('Thumbnails es requerida.'),
];

// GET /api/products/
productsRouter.get('/', async (req, res) => {
    try {
        let { limit = 10, page = 1, sort = '', query = '' } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);
        const skip = (page - 1) * limit;

        // Construir el objeto de consulta y ordenación
        let queryParams = query ? { $text: { $search: query } } : {};
        let sortParams = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

        // Obtener los productos con paginación y ordenación
        const products = await ProductModel.find(queryParams).sort(sortParams).skip(skip).limit(limit);
        const totalProducts = await ProductModel.countDocuments(queryParams);

        // Calcular el total de páginas
        const totalPages = Math.ceil(totalProducts / limit);

        res.json({
            status: 'success',
            payload: products,
            totalPages: totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            page: page,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
            nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null
        });
    } catch (error) {
        res.status(500).send('Error al obtener productos.');
    }
});

// GET /api/products/:pid
productsRouter.get('/:pid', async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.pid);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Producto no encontrado.');
        }
    } catch (error) {
        res.status(500).send('Error al obtener producto.');
    }
});

// POST /api/products/
productsRouter.post('/', validateProduct, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const newProduct = new ProductModel(req.body);
        const savedProduct = await newProduct.save();
        res.json(savedProduct);
    } catch (error) {
        res.status(500).send('Error al agregar producto.');
    }
});

// PUT /api/products/:pid
productsRouter.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            req.params.pid, 
            req.body, 
            { new: true, runValidators: true }
        );
        if(updatedProduct){
            res.json(updatedProduct);
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
        const deletedProduct = await ProductModel.findByIdAndDelete(req.params.pid);
        if(deletedProduct) {
            res.status(204).send();
        } else {
            res.status(404).send('Producto no encontrado.');
        }
    } catch (error) {
        res.status(500).send('Error al eliminar producto.');
    }
});

module.exports = productsRouter;