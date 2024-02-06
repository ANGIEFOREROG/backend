const fs = require('fs').promises;

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async getCartsFromFile() {
        try {
            const cartsData = await fs.readFile('carts.json', 'utf8');
            return JSON.parse(cartsData);
        } catch (error) {
            console.error('Error reading carts file:', error);
            return [];
        }
    }

    async saveCartsToFile(carts) {
        try {
            await fs.writeFile('carts.json', JSON.stringify(carts, null, 2), 'utf8');
        } catch (error) {
            console.error('Error writing carts to file:', error);
        }
    }

    generateCartId(carts) {
        const lastCart = carts[carts.length - 1];
        return lastCart ? lastCart.id + 1 : 1;
    }

    async createCart() {
        const carts = await this.getCartsFromFile();
        const newCart = {
            id: this.generateCartId(carts),
            products: []
        };
        carts.push(newCart);
        await this.saveCartsToFile(carts);
        return newCart;
    }

    async getCartById(cartId) {
        const carts = await this.getCartsFromFile();
        return carts.find(c => c.id === parseInt(cartId));
    }    

    async addOrUpdateProduct(cartId, productId) {
        let carts = await this.getCartsFromFile();
        const cartIndex = carts.findIndex(cart => cart.id === cartId);
    
        if (cartIndex !== -1) {
            const productIndex = carts[cartIndex].products.findIndex(product => product.id === productId);
            
            if (productIndex !== -1) {
                carts[cartIndex].products[productIndex].quantity += 1;
            } else {
                carts[cartIndex].products.push({ id: productId, quantity: 1 });
            }
    
            await this.saveCartsToFile(carts);
            return carts[cartIndex];
        }
        return null;
    }

    async removeProductFromCart(cartId, productId) {
        const carts = await this.getCartsFromFile();
        const cart = carts.find(c => c.id === parseInt(cartId));

        if (cart) {
            const index = cart.products.findIndex(p => p.id === parseInt(productId));
            if (index !== -1) {
                cart.products.splice(index, 1);
                await this.saveCartsToFile(carts);
            }
            return cart;
        } else {
            throw new Error('Carrito no encontrado.');
        }
    }
}

module.exports = CartManager;