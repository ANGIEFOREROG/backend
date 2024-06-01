
import { CustomError } from "../Errors/CustomError.js";
import { EErrorrs } from "../Errors/enums.js";
import { generateProductErrorInfo } from "../Errors/info.js";
import { ProductDao } from "../daos/factory.js";


export class ProductControllers{
    constructor(){
        this.productService = new ProductDao()
    }


//TRAER TODOS LOS PRODUCTOS
    getProducts = async (req, res) => {

        try {
        
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort || 'none';
        const query = req.query.query || '';
        
        
        const options = {
            page,
            limit,
            sort: sort === 'none' ? {} : { price: sort === 'asc' ? 1 : -1 },
        };
        
        
        const filter = query ? { title: new RegExp(query, 'i') } : {};
        
        
        const result = await this.productService.paginate(filter, options);
        
        res.json({
            total: result.totalDocs,
            limit: result.limit,
            page: result.page,
            sort,
            query,
            products: result.docs,
        });
        } catch (error) {
        req.logger.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        }
        }
        
        
//TRAER UN PRODUCTO
    getProduct =  async (req, res) => {

        const { pid } = req.params;
        
        try {
        const product = await this.productService.getProduct(pid);
        res.send(product);
        } 
        catch (error) {
        req.logger.info(error);
        res.status(500).send("Error interno del servidor");
        }
    }

//CREAR UN PRODUCTO
//CREAR UN PRODUCTO
createProduct = async (req, res, next) => {
    try {
        const { title, description, price, thumbnail, code, stock, status = true, category } = req.body;

        // Verificar si algún campo es nulo o indefinido
        if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
            CustomError.createError({
                name: "Products creation error",
                cause: generateProductErrorInfo({
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock,
                    status,
                    category
                }),
                message: "Error creating a product",
                code: EErrorrs.INVALID_TYPE_ERROR
            });
        }

        const productNew = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status,
            category,
        };

        const createdProduct = await this.productService.createProduct(productNew);
        res.status(200).json({ success: true, message: 'Producto creado exitosamente', product: createdProduct });
    } catch (error) {
        next(error);
    }
}

//ACTUALIZAR UN PRODUCTO
    updateProduct =async (req, res) => {

        const { pid } = req.params;
        
        const productToUpdate = req.body;
        
        try {
        const result = await this.productService.updateProduct(pid, productToUpdate);
        res.send(result);
        } 
        catch (error) {
        req.logger.info(error);
        res.status(500).send("Error interno del servidor");
        }
    }


//ELIMINAR UN PRODUCTO
deletProduct = async (req, res) => {
    const { pid } = req.params;
    const { role, email } = req.user; // Obtén el rol y el correo electrónico del usuario desde la solicitud

    try {
        const product = await this.productService.getProductById(pid);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Verificar los permisos de eliminación
        if (role === 'admin' || (role === 'premium' && product.owner === email)) {
            // El usuario tiene permiso para eliminar el producto
            const result = await this.productService.deleteProduct(pid);
            return res.send(result);
        } else {
            return res.status(403).json({ error: 'No tienes permiso para eliminar este producto' });
        }
    } catch (error) {
        req.logger.error('Error al eliminar el producto:', error);
        res.status(500).send("Error interno del servidor");
    }
}
}
