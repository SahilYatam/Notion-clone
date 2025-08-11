import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js"

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = req.cookies.accessToken || (authHeader?.startsWith("Bearer") ? authHeader.split(" ")[1] : null);

    if(!token) throw new ApiError(401, "Unauthorized - No token");

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN)
        req.userId = decoded.userId || decoded.id || decoded.sub
        next();
    } catch (error) {
        if(error.name === "TokenExpiredError") throw new ApiError(401, "Token Expired");
        throw new ApiError(401, "Invalid Token")
    }

}