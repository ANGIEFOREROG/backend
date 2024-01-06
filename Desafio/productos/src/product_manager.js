const fs = require('fs').promises;

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
    }

    async addProduct(product) {
        product.id = await this.getNextId();
        const products = await this.getProductsFromFile();
        products.push(product);
        await this.saveProductsToFile(products);
    }

    async getProducts() {
        return await this.getProductsFromFile();
    }

    async getProductById(id) {
        const products = await this.getProductsFromFile();
        return products.find(p => p.id === id);
    }

    async updateProduct(id, updatedProduct) {
        const products = await this.getProductsFromFile();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...updatedProduct, id };
            await this.saveProductsToFile(products);
            return true;
        }
        return false;
    }

    async deleteProduct(id) {
        const products = await this.getProductsFromFile();
        const updatedProducts = products.filter(p => p.id !== id);
        await this.saveProductsToFile(updatedProducts);
    }

    async getNextId() {
        const products = await this.getProductsFromFile();
        const lastProduct = products[products.length - 1];
        return lastProduct ? lastProduct.id + 1 : 1;
    }

    async getProductsFromFile() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async saveProductsToFile(products) {
        await fs.writeFile(this.path, JSON.stringify(products, null, 2), 'utf8');
    }
}

// Ejemplo de uso
const manager = new ProductManager('products.json');

(async () => {
    // Añadir productos
    await manager.addProduct({
        title: "cuadrocaricaturas",
        description: "cuadro en acrilico",
        price: 20000,
        thumbnail: "image/to/caricaturas.jpg",
        code: "ab000",
        stock: 10
    });

    await manager.addProduct({
        title: "cuadros mascotas",
        description: "cuadro en madera",
        price: 15000,
        thumbnail: "image/to/mascotas.jpg",
        code: "ab001",
        stock: 30
    });

    await manager.addProduct({
        title: "cuadro familia",
        description: "cuadro familiar decoracion de sala",
        price: 14000,
        thumbnail: "image/to/familiar.jpg",
        code: "ab002",
        stock: 10
    });

    await manager.addProduct({
        title: "cuadro superheroes",
        description: "cuadros para niños",
        price: 30000,
        thumbnail: "image/to/superheroes.jpg",
        code: "ab003",
        stock: 15
    });

    // Obtener todos los productos
    const products = await manager.getProducts();
    console.log("Todos los productos:", products);

    // Obtener producto por ID
    const productId = 2; // Por ejemplo, el ID 2
    const productById = await manager.getProductById(productId);
    console.log("Producto por ID:", productById);

    // Actualizar producto
    const updatedProduct = {
        title: "nuevo cuadro mascotas",
        description: "hermos cuadro en madera",
        price: 2500,
        thumbnail: "image/to/wireless-cuadromascotas.jpg",
        code: "ab001",
        stock: 55
    };
    await manager.updateProduct(productId, updatedProduct);
    console.log("Producto actualizado.");

    // Eliminar producto
    await manager.deleteProduct(4); // Por ejemplo, eliminar el producto con ID 4 
    console.log("Producto eliminado.");

    // Verificar productos actualizados
    const updatedProducts = await manager.getProducts();
    console.log("Productos actualizados:", updatedProducts);
})();

module.exports = ProductManager;