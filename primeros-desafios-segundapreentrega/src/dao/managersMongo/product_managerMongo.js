const ProductModel = require('../models/products.model');

class ProductManagerMongo {
    async getAllProducts(limit) {
        const query = ProductModel.find({});
        return limit ? await query.limit(limit) : await query;
    }

    async getProductById(productId) {
        return await ProductModel.findById(productId);
    }

    async addProduct(productData) {
        const product = new ProductModel(productData);
        return await product.save();
    }

    async updateProduct(productId, productData) {
        return await ProductModel.findByIdAndUpdate(productId, productData, { new: true });
    }

    async deleteProduct(productId) {
        return await ProductModel.findByIdAndDelete(productId);
    }
}

module.exports = ProductManagerMongo;
