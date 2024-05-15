import { Router } from "express";
import auth from "../middleware/authentication.middleware.js";
import UserManagerMongo from "../daos/Mongo/UserManagerMongo.js";


const sessionRouter = Router()


sessionRouter.get ("/session", (req, res) => {

    if(req.session.counter){
        
        req.session.counter ++
        res.send(`Usted ha visitado este sitio ${req.session.counter} veces`)

    }else{
        req.session.counter = 1
        res.send("Bienvenido a la pagina")
    }
})

sessionRouter.get ("/logout", (req, res) => {
    req.session.destroy(error =>{
        if (error) res.send ("error en el Logout")
        res.send({status : "success", message : "Logout ok"})
    })
})

const sessionUser = new UserManagerMongo()


//INGRESAR 


sessionRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    const user = await sessionUser.getUserBy({ email: email });

    if (!user) {
        return res.send({ status: "error", error: "No existe ese usuario con ese email" });
    }

    if (email === "adminCoder@coder.com" && password === "123456") {
    
        req.session.user = { id: user.id, email: user.email, role: "admin" };
    } else {

        req.session.user = { id: user.id, email: user.email, role: "usuario" };
    }

res.redirect("/products")
   

})

//REGISTRO

sessionRouter.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        console.log("Received request with data:", req.body);

        if (email === "" || password === "") {
            return res.send("Campos obligatorios");
        }

        const existingUsers = await sessionUser.getUsers({ email: email });

        console.log("Existing users:", existingUsers);

        if (existingUsers.length > 0) {
            console.log("User already exists");
            return res.send("El usuario ya está registrado. <a href='/login'>Ir a la página de inicio de sesión</a>");
        }

        const newUser = {
            first_name,
            last_name,
            email,
            password
        };

        await sessionUser.createUser(newUser); 
        console.log("Usuario registrado:", newUser);

        res.redirect("/login");
    } catch (error) {
        console.error("Error during registration:", error);
        res.send({ status: "error", error: error.message });
    }
});



sessionRouter.get("/current", auth, (req, res) => {
    console.log(req.session.user);
    res.send("datos sensibles");
});


export default sessionRouter