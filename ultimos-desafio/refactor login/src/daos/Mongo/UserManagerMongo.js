import usersModel from "../../models/users.model.js";

class UserManagerMongo {

    
    async getUsers(filter){
        return await usersModel.find({filter})
    }

    async getUserBy (filter){
        return await usersModel.findOne(filter)
    }
  
    async createUser(userNew){
        
        return await usersModel.create(userNew)
    }

}

export default UserManagerMongo