// home.js

const socket = io();

// Obtener referencia a elementos HTML
const productList = document.getElementById('productList');

// Escuchar evento para actualizar la lista de productos en tiempo real
socket.on('updateProducts', (products) => {
    // Limpiar la lista antes de agregar los nuevos productos
    productList.innerHTML = '';

    products.forEach((product) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>ID:</strong> ${product.id} <br>
            <strong>Título:</strong> ${product.title} <br>
            <strong>Descripción:</strong> ${product.description} <br>
            <strong>Código:</strong> ${product.code} <br>
            <strong>Precio:</strong> ${product.price} <br>
            <strong>Status:</strong> ${product.status} <br>
            <strong>Stock:</strong> ${product.stock} <br>
            <strong>Categoría:</strong> ${product.category} <br>
            <strong>Thumbnails:</strong> ${product.thumbnails} <br>
        `;
        productList.appendChild(li);
    });
});
