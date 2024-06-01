import mongoose from "mongoose";

const {Schema} = mongoose

const tokenCollection = "token"

const tokenSchema = new Schema( {

token: { 
    type: String, 
    required: true },

userEmail: {
    type: String, 
    required: true },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: '1h' } 
});

const tokenModel= mongoose.model(tokenCollection, tokenSchema);

export default tokenModel