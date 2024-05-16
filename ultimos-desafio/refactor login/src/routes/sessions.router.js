import { Router } from "express";
import auth from "../middleware/authentication.middleware.js";
import UserManagerMongo from "../daos/Mongo/UserManagerMongo.js";
import usersModel from "../models/users.model.js";
import { createHash, isValidPassword } from "../hashBcrypt.js";
import passport from "passport";


const sessionRouter = Router()

//SESSION
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


//REGISTRO 


sessionRouter.post("/register",passport.authenticate("register", {failureRedirect: "/api/session/failregister"}), async(req, res)=>{

    res.send({status:"succes", message: "usuario registrado"})

})

sessionRouter.get("/failregister", async(req, res) =>{
    res.send({error: "Registro fallido"})
})


//INICIO DE SESION

sessionRouter.post("/login",passport.authenticate("login", {failureRedirect: "/api/session/faillogin"}), async(req, res)=>{

    if(!req.user) return res.status(401).send({status: "Error", error: "credencial invalida"})

    req.session.user ={
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        id: req.user._id
    }
    res.send({status:"sucess", message: req.user})
})

sessionRouter.get("/faillogin", async(req, res) =>{
    res.send({error: "Login fallido"})
})



//GITHUB

sessionRouter.get("/github", passport.authenticate("github", 
{scope: ['user: email']}), async (req, res) => {
    
  });

//GITHUBCALLBACK

sessionRouter.get("/githubcallback",passport.authenticate("github", {failureRedirect:"/login"} ), async(req, res)=>{
    req.session.user = req.user
    res.redirect("/products")
})
//CURRENT 
sessionRouter.get("/current", auth, (req, res) => {
    
    res.send("datos sensibles");
});


export default sessionRouter