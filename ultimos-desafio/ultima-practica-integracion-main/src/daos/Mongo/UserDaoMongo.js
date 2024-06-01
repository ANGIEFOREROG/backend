import usersModel from "./models/users.model.js";

class UserDaoMongo {

    
    async getUsers(filter){
        return await usersModel.find({filter})
    }

    async getUserBy (filter){
        return await usersModel.findOne(filter)
    }
  
    async createUser(userNew){
        
        return await usersModel.create(userNew)
    }
    async updateUser(uid, userToUpdate) {
        try {
          // Si userToUpdate incluye la propiedad 'password', significa que se está actualizando la contraseña
          if (userToUpdate.password) {
            // Actualizar la contraseña del usuario utilizando su ID
            await usersModel.findByIdAndUpdate(uid, { password: userToUpdate.password });
            return { message: 'Contraseña actualizada correctamente.' };
          } else {
            // Si no se está actualizando la contraseña, proceder con la actualización del usuario como de costumbre
            return await usersModel.findByIdAndUpdate(uid, userToUpdate);
          }
        } catch (error) {
          throw error;
        }
      }
   
      // Función para actualizar la contraseña del usuario por su correo electrónico
async updatePasswordByEmail(email, newPassword) {
  try {
    // Busca al usuario por su correo electrónico
    const user = await usersModel.findOne({ email });

    // Verifica si el usuario existe
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Actualiza la contraseña del usuario
    user.password = newPassword;
    await user.save();

    // Retorna un mensaje de éxito o cualquier otro valor que desees
    return 'Contraseña actualizada exitosamente';
  } catch (error) {
    // Captura cualquier error y devuélvelo
    throw error;
  }
}
    async deleteUser(uid){
        return usersModel.findByIdAndDelete({_id: uid})
    } 
}

export default UserDaoMongo


