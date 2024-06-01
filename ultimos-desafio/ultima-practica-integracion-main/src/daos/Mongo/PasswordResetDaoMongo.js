import jwt from 'jsonwebtoken';
import { configObject } from '../../config/connectDB.js';
import usersModel from './models/users.model.js';
import { UserDao } from '../factory.js';
import tokenModel from './models/token.models.js';


const { jwt_private_key } = configObject;

class PasswordResetDaoMongo {
    async generatePasswordResetToken(email) {
        try {
          // Buscar al usuario por el email
        const user = await usersModel.findOne({ email });
        console.log("email de usuario desde dao", user);
    
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        
        const payload = {
            userId: user._id,
            email: user.email
        };
        console.log("informacion del usuario", payload);

// Generar el token con el payload y la clave privada
        const token = jwt.sign(payload, jwt_private_key, { expiresIn: '1h' });
        console.log("el token", token);
        
// Guardar el token en la base de datos
        await tokenModel.create({ token, userEmail: user.email });
    
        return token;
        } catch (error) {
        throw error;
        }
    }
    
async getEmailFromToken(token) {
    try{
    const decodedToken = jwt.verify(token, jwt_private_key);;
    const email = decodedToken.email;
    console.log(("el email del token", email));
    return email;
  } catch (error) {
    throw new Error('Error al extraer el correo electrónico del token en la URL');
  }
}
}

export default PasswordResetDaoMongo