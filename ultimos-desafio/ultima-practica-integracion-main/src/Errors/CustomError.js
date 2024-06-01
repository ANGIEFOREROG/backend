export class CustomError{
    static createError({name = "Error", cause = "", message= "undefined", code=1}) {
        let error = new Error( message)
        error.name = name
        error.cause = cause
        error.code = code
        
        throw error 
    }
}