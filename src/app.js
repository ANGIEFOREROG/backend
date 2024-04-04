const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const { engine } = require('express-handlebars');
const ProductManager = require('./dao/managers/product_manager.js');
const productRoutes = require('./routers/productRoutes');
const cartRoutes = require('./routers/cartRoutes');
const usersRouter = require('./routers/users.router');
const viewsRouter = require('./routers/viewRoutes');
const { connectBD } = require('./config/connectDB.js');
const MessagesManagerMongo = require('./dao/managersMongo/messagesManagerMongo.js');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const messagesManager = new MessagesManagerMongo();

connectBD()

const port = 8080;

const productManager = new ProductManager('products.json');

app.use(express.static(path.join(__dirname, 'public')));

// Modificar esta parte para incluir las opciones de Handlebars
app.engine('handlebars', engine({
    defaultLayout: 'main',
    handlebars: require('handlebars'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para manejar solicitudes JSON y URL codificadas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de rutas
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/users', usersRouter);
app.use('/', viewsRouter);

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

// Configurar rutas de vistas
app.get('/home', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).send('Error al obtener productos.');
    }
});

app.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).send('Error al obtener productos.');
    }
});

// Route for chat
app.get('/chat', (req, res) => {
    res.render('chat');
});


// Socket.io
io.on('connection', (socket) => {
    console.log('Usuario conectado');

    socket.on('addProduct', async (productData) => {
        try {
            // Agregar lógica para crear un nuevo producto con los datos recibidos
            await productManager.addProduct(productData);
            console.log('Evento addProduct emitido al servidor');

            // Obtener la lista actualizada de productos después de agregar el nuevo producto
            const updatedProducts = await productManager.getProducts();

            // Emitir la lista actualizada de productos a todos los clientes conectados
            io.emit('updateProducts', updatedProducts);

            console.log('Nuevo producto agregado:', productData);
        } catch (error) {
            console.error('Error al agregar un nuevo producto:', error);
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            // Utiliza la instancia de tu ProductManager para eliminar el producto.
            await productManager.deleteProduct(productId);
            // Después de eliminar, obtén la lista actualizada de productos.
            const updatedProducts = await productManager.getProducts();
            // Envía la lista actualizada a todos los clientes conectados.
            io.emit('updateProducts', updatedProducts);
        } catch (error) {
            // Manejo de errores, por ejemplo, si el ID del producto no existe.
            socket.emit('error', 'Product deletion failed');
        }
    });
    
    // Handler for new messages
    socket.on('new message', async (data) => {
        try {
            const newMessage = await messagesManager.createMessage(data.user, data.message);
            io.emit('new message', newMessage);
        } catch (error) {
            console.error('Error al guardar el mensaje:', error);
        }
    });    

    // Handler for loading previous messages
    socket.on('load previous messages', async () => {
        try {
            const previousMessages = await MessagesManagerMongo.getAllMessages();
            socket.emit('previous messages', previousMessages);
        } catch (error) {
            console.error('Error al cargar mensajes anteriores:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

// Función para limpiar los datos y convertirlos en un objeto con propiedades propias
function cleanData(data) {
    return JSON.parse(JSON.stringify(data));
}

server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});