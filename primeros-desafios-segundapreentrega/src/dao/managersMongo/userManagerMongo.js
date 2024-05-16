const userModel = require("../models/users.model");

class UserManagerMongo {
    async getUsers(){
        return await userModel.find({});
    }
    async getUser(uid){
        return await userModel.findOne({_id: uid});
    }
    async createUser(userNew){
        return await userModel.create(userNew);
    }
    async updateUser(uid, userUpdates){
        return await userModel.findByIdAndUpdate(uid, userUpdates, { new: true });
    }
    async deleteUser(uid){
        return await userModel.findByIdAndDelete(uid);
    }
}

module.exports = UserManagerMongo;
