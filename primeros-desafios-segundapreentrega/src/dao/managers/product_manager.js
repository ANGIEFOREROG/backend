const fs = require('fs').promises;
const { readFile, writeFile } = require('fs').promises;

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
        await writeFile(this.path, JSON.stringify(products, null, 2), 'utf8');
    }    
}

// Ejemplo de uso
const manager = new ProductManager('products.json');

(async () => {
    // Añadir productos
    await manager.addProduct({
        title: "Laptop",
        description: "Una computadora portátil",
        price: 1000,
        thumbnail: "path/to/laptop.jpg",
        code: "LPTP001",
        stock: 10
    });

    await manager.addProduct({
        title: "Mouse",
        description: "Un ratón para computadora",
        price: 20,
        thumbnail: "path/to/mouse.jpg",
        code: "MS001",
        stock: 50
    });

    await manager.addProduct({
        title: "Teclado",
        description: "Un teclado para computadora",
        price: 50,
        thumbnail: "path/to/keyboard.jpg",
        code: "KB001",
        stock: 30
    });

    await manager.addProduct({
        title: "Monitor",
        description: "Un monitor de pantalla plana",
        price: 200,
        thumbnail: "path/to/monitor.jpg",
        code: "MNT001",
        stock: 20
    });

    // Obtener todos los productos
    const products = await manager.getProducts();
    //console.log("Todos los productos:", products);

    // Obtener producto por ID
    const productId = 2; // Por ejemplo, el ID del producto "Mouse"
    const productById = await manager.getProductById(productId);
    //console.log("Producto por ID:", productById);

    // Actualizar producto
    const updatedProduct = {
        title: "Mouse inalámbrico",
        description: "Un ratón inalámbrico para computadora",
        price: 25,
        thumbnail: "path/to/wireless-mouse.jpg",
        code: "MS001",
        stock: 45
    };
    await manager.updateProduct(productId, updatedProduct);
    //console.log("Producto actualizado.");

    // Eliminar producto
    await manager.deleteProduct(4); // Por ejemplo, eliminar el producto con ID 4 (Monitor)
    //console.log("Producto eliminado.");

    // Verificar productos actualizados
    const updatedProducts = await manager.getProducts();
    //console.log("Productos actualizados:", updatedProducts);
})();

module.exports = ProductManager;