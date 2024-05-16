import passport from "passport";
import  local  from "passport-local";
import GitHubStrategy from "passport-github2";
import { createHash } from "../hashBcrypt.js";
import { isValidPassword } from "../hashBcrypt.js";
import usersModel from "../models/users.model.js";



const LocalStrategy = local.Strategy

const initializePassport = () => {
    //REGISTRO
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    } , async(req, username, password, done) =>{
      const {first_name, last_name, email} = req.body

      try {

        let user = await usersModel.findOne({email})

        if(user) return done( null, false)

        let newUser = {
          first_name,
          last_name,
          email,
          password: createHash(password)
        }

        let result = await usersModel.create(newUser)

        return done(null, result)
        
      } catch (error) {
            return done(error)
      }

    }))

    //LOGIN
    passport.use("login", new LocalStrategy({
      usernameField: "email"
    }, async (username, password, done)=>{
      try {
        const user = await usersModel.findOne({email: username})
        if (!user){
          console.log("usuario no encontrado");
          return done(null, false)
        }
        if(!isValidPassword(password, user.password)) return done(null, false)
          return done(null, user)
        
      
      } catch (error) {
        return  done (error)
      }

    }))


      passport.serializeUser((user, done)=> {
        done(null, user._id)
      })
      passport.deserializeUser(async (id, done)=>{
        let user= await usersModel.findById({_id: id})
        done(null, user)
      })

    //GITHUB

    passport.use('github', new GitHubStrategy({
      clientID:'Iv23lijAXRcGAUjbaBSK',
      clientSecret:'79c6c842a7a696c5d951420b7d268ae55dc5a3ac' ,
      callbackURL: 'http://localhost:8083/api/session/githubcallback',
  
    }, async (accessToken, refreshToken, profile, done)=>{
      console.log('profile: ', profile)
      try {
              let user = await usersModel.findOne({email: profile._json.email})
              if (!user) {
                  let newUser = {
                      first_name: profile._json.name,
                      last_name: profile._json.name,
                      email: profile._json.email,
                      password: ''
                  }

                  let result = await usersModel.create(newUser)
                  return done(null, result)
              }

              return done(null, user)
      } catch (error) {
          done(error)
      }
  }))
}

export default initializePassport;