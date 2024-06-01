import { EErrorrs } from "../../Errors/enums.js";



export const handleErrors = (error, req, res, next) => {
    console.log(error.cause);

    switch (error.code) {
        case EErrorrs.INVALID_TYPE_ERROR:
            return res.status(400).json({ status: "Error", error: error.name });
        case EErrorrs.ROUTING_ERROR:
            return res.status(404).json({ status: "Error", error: error.name });
        case EErrorrs.DATEBASE_ERROR:
            return res.status(500).json({ status: "Error", error: error.name });
        default:
            return res.status(500).json({ status: "Error", error: "Internal server error" });
    }
}