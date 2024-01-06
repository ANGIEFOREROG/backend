// cartManager.js
const fs = require('fs').promises;

// generar un ID único para el carrito
function generateCartId(carts) {
    const lastCart = carts[carts.length - 1];
    return lastCart ? lastCart.id + 1 : 1;
}

async function readCartsFile() {
    try {
        return JSON.parse(await fs.readFile('carts.json', 'utf8'));
    } catch (error) {
        console.error(error);
        throw new Error('Error al leer el archivo de carritos.');
    }
}

async function writeCartsFile(carts) {
    try {
        await fs.writeFile('carts.json', JSON.stringify(carts, null, 2));
    } catch (error) {
        console.error(error);
        throw new Error('Error al escribir en el archivo de carritos.');
    }
}

module.exports = {
    generateCartId,
    readCartsFile,
    writeCartsFile
};
