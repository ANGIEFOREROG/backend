const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            this.products = JSON.parse(data) || [];
        } catch (error) {
            this.products = [];
        }
    }

    saveProducts() {
        const data = JSON.stringify(this.products, null, 2);
        fs.writeFileSync(this.filePath, data, 'utf8');
    }

    getProducts() {
        return this.products;
    }

    addProduct(product) {
        if (
            !product.title ||
            !product.description ||
            !product.price ||
            !product.thumbnail ||
            !product.code ||
            product.stock === undefined
        ) {
            throw new Error('Ingrese todos los datos del producto');
        }

        const result = this.products.find((prod) => prod.code === product.code);

        if (result) {
            throw new Error('Ya existe un producto con el código proporcionado');
        }

        product.id = this.generateProductId();
        this.products.push(product);
        this.saveProducts();
        return 'Producto añadido al inventario';
    }

    getProductById(pid) {
        const result = this.products.find((prod) => prod.id === pid);

        if (!result) {
            throw new Error('No existe un producto con ese ID');
        }

        return result;
    }

    updateProduct(id, updatedProduct) {
        const index = this.products.findIndex((prod) => prod.id === id);

        if (index === -1) {
            throw new Error('No existe un producto con ese ID');
        }

        this.products[index] = { ...this.products[index], ...updatedProduct };
        this.saveProducts();
        return 'Producto actualizado';
    }

    deleteProduct(id) {
        const index = this.products.findIndex((prod) => prod.id === id);

        if (index === -1) {
            throw new Error('No existe un producto con ese ID');
        }

        this.products.splice(index, 1);
        this.saveProducts();
        return 'Producto eliminado';
    }

    generateProductId() {
        return this.products.length === 0 ? 1 : this.products[this.products.length - 1].id + 1;
    }
}

const products = new ProductManager('productos.json');

try {
    console.log(
        products.addProduct({
            title: 'Cuadro caricaturas',
            description: 'Hermoso cuadro de caricaturas',
            price: 26000,
            thumbnail: 'imagen',
            stock: 15,
            code: 'abc01',
        })
    );

    console.log(
        products.addProduct({
            title: 'Cuadro personalizado',
            description: 'Personaliza tu cuadro a tu estilo',
            price: 45000,
            thumbnail: 'imagen',
            stock: 30,
            code: 'abc02',
        })
    );

    console.log(products.getProducts());
    console.log(products.getProductById(1));

    console.log(
        products.updateProduct(1, {
            description: 'Cuadro caricaturas actualizado',
            price: 30000,
        })
    );

    console.log(products.getProducts());

    console.log(products.deleteProduct(1));
    console.log(products.getProducts());
} catch (error) {
    console.error(error.message);
}
