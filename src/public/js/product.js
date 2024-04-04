function addToCart(productId) {
    // Obtener el ID del carrito desde el almacenamiento local
    const cartId = localStorage.getItem('cartId');
    
    fetch(`/carts/${cartId}/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Producto añadido al carrito');
    })
    .catch(error => {
        console.error('Error al añadir producto al carrito:', error);
        alert('Error al añadir producto al carrito');
    });
}