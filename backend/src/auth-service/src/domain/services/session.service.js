import { getPrismaClient } from "../../infrastructure/db/db.js";
import { ApiError } from "../../../../shared/utils/ApiError.js"
import { helperFunction } from "../../utils/helperFunctions.js";

import { generateToknes } from "../../infrastructure/auth/jwt.service.js";

import logger from "../../../../shared/utils/logger.js";
import * as UAParser from 'ua-parser-js';



import axios from "axios";

/**
 * @type {import('@prisma/client').PrismaClient}
 */
let prisma = new getPrismaClient();

const createSession = async (userId, refreshToken, ipAddress, userAgent, tokenExpireAt) => {
    try {
        const parser = new UAParser.UAParser(); 
        parser.setUA(userAgent)

        const browser = parser.getBrowser() // {name: "FireFox"}
        const os = parser.getOS() // {name: "Linux"}
        const device = parser.getDevice() // {type: 'desktop',}

        const deviceName = `${browser.name || "Unknown Browser"} on ${os.name || "Unknown OS"}`
        const deviceType = device.type || "Desktop"

        const location = getLocationByIp(ipAddress)

        const hashedRefreshToken = helperFunction.hashToken(refreshToken)
        const session = await prisma.session.create({
            data: {
                userId,
                refreshToken: hashedRefreshToken,
                ipAddress,
                userAgent,
                deviceName,
                deviceType,
                location,
                lastActivity: new Date(),
                expiresAt: tokenExpireAt,
                isActive: true
            }
        })

        logger.info(`Session created for user ${userId} (Session ID: ${session.id})`,)
        return {
            userId,
            sessionId: session.id,
            message: `Session successfully created for user ${userId} (Session ID: ${session.id})`,
        };
    } catch (error) {
        logger.error(`Error while creating session, user: ${userId}`, { message: error.message, stack: error.stack });
        throw new ApiError(500, "Internal server error");
    }
}

const getClientIp = (req) => {
    const xForwardedFor = req.headers["x-forwarded-for"];

    if (xForwardedFor) {
        return xForwardedFor.split(',')[0].trim();
    };

    return req.conntection?.remoteAddress || req.socket?.remoteAddress || null;
}

const getLocationByIp = async (ipAddress) => {
    try {
        const {data} = await axios.get(`http://ip-api.com/json/${ipAddress}?fields=country,regionName,city,lat,lon,status,message`);

        if(data.status === "success") {
            return {
                country: data.country,
                region: data.regionName,
                city: data.city,
                latitude: data.lat,
                longitude: data.lon,
            }
        }else{
            return {error: `GeoIP lookup failed: ${data.message}`}
        }

    } catch (error) {
        logger.error('GeoIP lookup error:', error.message);
        return { error: 'GeoIP request failed' }
    }
}

const clearExpireSession = async () => {
    const thirtyDays = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
    try {
        const result = await prisma.session.deleteMany({
            where:{expiresAt: {lt: thirtyDays}, isActive: false},
        })
        if(result.count > 0) {
            logger.info(`🧹 Removed ${result.count} expired sessions`)
        }
    } catch (error) {
        logger.error("❌ Failed to clean expired sessions:", {message: error.message, stack: error.stack});
    }
}

const getSessionByRefreshToken = async (token) => {
    if(!token) throw new ApiError(404, "Refresh token not found");

    const hashedToken = helperFunction.hashToken(token);

    const session = await prisma.session.findFirst({
        where: {
            refreshToken: hashedToken,
            isActive: true,
            expiresAt: {gt: Date.now()}
        }
    });

    if(!session) throw new ApiError(403, "Session not found or refresh token is invalid");
    logger.warn("Invalid refresh attempt", { tokenHash: hashedToken })

    return session;
}

const refreshAccessToken = async (token) => {
    try {
        if(!token) throw new ApiError(401, "Unauthorized request");
    
        const session = await getSessionByRefreshToken(token);
    
        const {accessToken, refreshToken: rawRefreshToken, refreshTokenExpiry} =  generateToknes(session.userId);

        const newRefreshToken = helperFunction.hashToken(rawRefreshToken)
    
        await prisma.session.update({
            where: {id: session.id},
            data: {
                refreshToken: newRefreshToken,
                expiresAt: refreshTokenExpiry
            }
        });

        return {accessToken, rawRefreshToken};
    } catch (error) {
        logger.error("Error in refreshAccess Token", {message: error.message, stack: error.stack});
        throw new ApiError(500, "Failed to refresh access token");
    }
}

const getUserSessions = async (userId) => {
    const sessions = await prisma.session.findMany({
        where: {userId, isActive: true},
        select: {
            id: true,
            deviceName: true,
            deviceType: true,
            userAgent: true,
            ipAddress: true,
            location: true,
            lastActivity: true,
            isActive: true,
            expiresAt: true,
            createdAt: true,
        }
    });
    return sessions
}

export const sessionService = {
    createSession,
    getClientIp,
    clearExpireSession,
    refreshAccessToken,
    getUserSessions
}
