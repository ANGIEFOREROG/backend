import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";



const { Schema } = mongoose;



const productsCollection = "products";

const productsSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  code: String,
  stock: Number,
  status: Boolean,
  category: String,
  isActive:{
    type: Boolean,
    default:true
  }, 
  owner: {
    type: mongoose.Schema.Types.ObjectId, // O mongoose.Schema.Types.String si deseas almacenar el correo electrónico
    ref: 'users', // Hace referencia al modelo de usuario
    default: null // Asigna el valor por defecto
  }
  
})
;


productsSchema.plugin(mongoosePaginate)
const productModel = mongoose.model(productsCollection, productsSchema);

export default productModel;


