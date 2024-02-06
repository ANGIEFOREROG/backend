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
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const query = ProductModel.find({});
        const products = limit ? await query.limit(limit) : await query;
        res.json(products);
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