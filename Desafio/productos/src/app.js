const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');
const ProductManager = require('./product_manager');
const productRoutes = require('./routers/productRoutes');
const cartRoutes = require('./routers/cartRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 8080;

const productManager = new ProductManager('products.json');

// Configurar Handlebars
app.engine('.handlebars', exphbs.engine({ defaultLayout: 'main', extname: '.handlebars' }));
app.set('view engine', '.handlebars');


// Middleware para servir archivos estáticos (si tienes algún directorio con archivos estáticos)
// app.use(express.static('public'));

app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const products = await productManager.getProducts();
        
        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos.' });
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener producto.' });
    }
});

app.get('/home', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos.' });
    }
});

app.get('/realTimeProducts', (req, res) => {
    // Aquí puedes enviar datos a la vista si es necesario
    res.render('realTimeProducts');
});

// Socket.io: Manejo de eventos (Puedes personalizar según tus necesidades)
io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    // Ejemplo: Manejo de un evento desde el cliente
    socket.on('productoNuevo', (producto) => {
        // Lógica para manejar un nuevo producto desde el cliente
        console.log('Nuevo producto recibido:', producto);
        // Actualiza la vista en tiempo real (puedes emitir eventos a los clientes conectados)
    });

    // Puedes agregar más lógica para manejar eventos según tus necesidades
});

io.on('connection', (socket) => {
    // Enviar la lista de productos cuando un cliente se conecta
    io.emit('updateProducts', productManager.getProducts());

    // Manejar el evento para agregar un nuevo producto
    socket.on('addProduct', (productData) => {
        productManager.addProduct(productData);
        io.emit('updateProducts', productManager.getProducts());
    });

    // Manejar el evento para eliminar un producto
    socket.on('deleteProduct', (productId) => {
        productManager.deleteProduct(productId);
        io.emit('updateProducts', productManager.getProducts());
    });
});

server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});