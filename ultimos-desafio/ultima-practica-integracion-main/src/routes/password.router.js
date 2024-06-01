import { Router } from "express";
import {PasswordResetController} from "../controllers/PasswordReset.controller.js";
import { passportCall } from "../middleware/passportCall.js";
import authorization from "../middleware/authentication.middleware.js";

const passwordRouter= Router()

const{requestPasswordReset,
 
    updatePassword
    } = new PasswordResetController()


passwordRouter.post("/requestPassword",requestPasswordReset)



passwordRouter.post("/updatePassword", updatePassword)

export default passwordRouter