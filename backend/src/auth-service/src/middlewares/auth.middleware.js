import { getPrismaClient } from "../infrastructure/db/db.js";
import {ApiError} from "../utils/ApiError.js";
import logger from "../utils/logger.js"
import jwt from "jsonwebtoken";

/**
 * @type {import('@prisma/client').PrismaClient}
 */

export const authentication = async (req, res, next) => {
  let prisma;
  try {
    prisma = getPrismaClient();    
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    const accessToken = req.cookies.accessToken || tokenFromHeader

    if (!accessToken)
      throw new ApiError(401, "Unauthorized - No access token provided");

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
    if (!decoded.userId) {
     throw new ApiError(401, "Invalid token payload");
    }

    const user = await prisma.auth.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) throw new ApiError(401, "Invalid token - user not found");

    req.user = user;
    next();
  } catch (error) {
    logger.error("❌ Authentication middleware error", {
      message: error.message,
    });

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
        errorMessage: error.message
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
        errorMessage: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      errorMessage: error.message
    });
  }finally{
    if(prisma){
        await prisma.$disconnect();
    }
  }
};
