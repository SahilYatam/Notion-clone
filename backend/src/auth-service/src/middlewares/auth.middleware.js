import { prisma } from "../infrastructure/db/db.js";
import {ApiError} from "../../../shared/utils/ApiError.js";
import logger from "../../../shared/utils/logger.js"
import jwt from "jsonwebtoken";

/**
 * @type {import('@prisma/client').PrismaClient}
 */

export const authentication = async (req, res, next) => {
  try { 
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    const accessToken = req.cookies.accessToken || tokenFromHeader

    if (!accessToken)
      throw new ApiError(401, "Unauthorized - No access token provided");

    logger.debug("🔍 Attempting to verify token");

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);

    const userId = decoded.userId || decoded.id || decoded.sub;

    if (!userId) {
      logger.error("❌ Token payload missing user identifier", {
        payload: decoded,
        availableKeys: Object.keys(decoded)
      })
      throw new ApiError(401, "Invalid token payload - missing user identifier");
    }

    logger.debug("🔍 Looking up user with ID: ", userId);

    const user = await prisma.auth.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
        logger.error("❌ User not found in database", { userId });
        throw new ApiError(401, "Invalid token - user not found");
    }

    req.user = user;
    logger.debug("✅ Authentication successful", { userId: user.id });
    next();
  } catch (error) {
    logger.error("❌ Authentication middleware error", {
      message: error.message,
      stack: error.stack,
      name: error.name
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
  }
};
