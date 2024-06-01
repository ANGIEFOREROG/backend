
import { configObject, connectDB } from "../config/connectDB.js";
import CartDaoMongo from "./Mongo/CartDaoMongo.js";
import PasswordResetDaoMongo from "./Mongo/PasswordResetDaoMongo.js";

import ProductDaoMongo from "./Mongo/ProductsDaoMongo.js";
import TicketDaoMongo from "./Mongo/TicketsDaoMongo.js";
import UserDaoMongo from "./Mongo/UserDaoMongo.js";




export let ProductDao 
export let CartDao
export let TicketsDao
export let UserDao
export let PasswordDao

switch (configObject.persistence) {
    case "FILE":
        
        break;
    

    default:
        connectDB() 
        

        
        ProductDao= ProductDaoMongo;
        CartDao= CartDaoMongo;
        TicketsDao = TicketDaoMongo;
        UserDao = UserDaoMongo;
        PasswordDao = PasswordResetDaoMongo

    

        break;
}
