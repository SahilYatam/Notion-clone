import { prisma } from "../../infrastructure/db/db.js";
import { ApiError } from "../../../../../shared/utils/ApiError.js"
import { helperFunction } from "../../utils/helperFunctions.js";
import {redis} from "../../infrastructure/db/redisDb.js"
import jwt from "jsonwebtoken";
import logger from "../../../../../shared/utils/logger.js"

/**
 * @type {import('@prisma/client').PrismaClient}
 */

const toPublicUser = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    onboarding: user.onboardingStatus
});

const createAccount = async (userBody) => {
    const email = userBody.email.trim().toLowerCase()
    const userExist = await prisma.auth.findUnique({where: {email}});
    if(userExist) throw new ApiError(409,"An account with this email address already exists.");

    const otp = helperFunction.generateOTP()

    await redis.set(`otp:${email}`, JSON.stringify({
        otp: otp,
        attempts: 0,
    }), {ex: 600});

    const user = await prisma.auth.create({
        data: {
            email,
            onboardingStatus: "EMAIL_ENTERED"
        }
    });

    return {email: user.email, userOtp: otp, userId: user.id};
}

const verifyOtp = async (userBody, emailToken) => {
    let decodedToken;
    try {
        decodedToken = jwt.verify(emailToken, process.env.EMAIL_SECRET)
    } catch (error) {
        throw new ApiError(401, "Invalid or expired token", error.message);
    }

    const email =  decodedToken.email;
    const submittedOtp = userBody.otp;

    const redisKey = `otp:${email}`;

    const storedData = await redis.get(redisKey);
    
    if(!storedData) {
        throw new ApiError("OTP expired or not found")
    }

    const {otp: storedOtp, attempts} = storedData;

    if(attempts >= 5){
        await redis.del(redisKey);
        throw new ApiError(429, "To many failed attemps. Please request a new OTP.");
    }

    if(storedOtp !== submittedOtp){
        await redis.set(redisKey, JSON.stringify({
                otp: storedOtp,
                attempts: attempts + 1,
        }), {ex: 600})
        throw new ApiError(401, "Invalid OTP");
    }

    await redis.del(redisKey)

    let prisma = getPrismaClient();
    const user = await prisma.auth.update({
        where: {
            email
        },
        data: {
            onboardingStatus: "EMAIL_VERIFIED",
            isEmailVerified: true,
        }
    })

    return {email: user.email, userId: user.id, onboarding: user.onboardingStatus};
}

const validateCredentials = async (userId, userBody) => {
    const hashedPassword = await helperFunction.hashPassword(userBody.password)

    const userDetails = await prisma.auth.update({
        where: {id: userId},
        data: {
            name: userBody.name,
            password: hashedPassword,
            onboardingStatus: "COMPLETED"
        }
    })

    return toPublicUser(userDetails);
}

const login = async (userBody) => {
    const email =  userBody.email.trim().toLowerCase()
    const user = await prisma.auth.findUnique({ where: {email} });

    if(!user) throw new ApiError( 404,"No account found with the provided email address.");

    if(user.isEmailVerified !== true) throw new ApiError(403, "Please verify your email before logging in.");

    const isMatch = await helperFunction.comparePassword(userBody.password, user.password);

    if(!isMatch) throw new ApiError(401, "The provided password is incorrect.");

    return toPublicUser(user);
}

const getUserById = async(userId) => {
    const user = await prisma.auth.findUnique({
        where: {id: userId},
        select: {id: true}
    });
    return {userId: user.id};
}

const getUser = async(userId) => {
    const user = await prisma.auth.findUnique({
        where: {id: userId, isEmailVerified: true}
    });

    if(!user) throw new ApiError(104, "User not found");

    return toPublicUser(user);
}

const logout = async (refreshToken) => {
    try {
        const hashedToken = helperFunction.hashToken(refreshToken)
        const session = await prisma.session.delete({
            where: {refreshToken: hashedToken, isActive: true}
        });

        logger.info(`🔓 Session invalidated (Session ID: ${session.id})`);
        return { message: "Session invalidated successfully" };
    } catch (error) {
        if (error.code === 'P2025') {
            // Record not found
            logger.warn("⚠️ Session not found or already invalidated", { refreshToken: hashedToken });
            throw new ApiError(403, "Session not found or already invalidated");
        }

        logger.error("❌ Error during logout", { message: error.message, stack: error.stack });
        throw new ApiError(500, "Logout failed");   
    }
}

const forgetPassword = async (userBody) => {
    const email = userBody.email.trim().toLowerCase();
    const user = await prisma.auth.findUnique({where: {email}});
    
    if(!user) throw new ApiError(404, "User does not exist with this email.");

    const rawToken = helperFunction.generateToken(32)
    const hashedToken = helperFunction.hashToken(rawToken);

    const resetTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.auth.update({
        where: {id: user.id},
        data: {
            resetPasswordToken: hashedToken,
            resetPasswordExpiresAt: resetTokenExpiresAt
        }
    })

    return {email: user.email, rawToken, userId: user.id};;
}

const resetPassword = async(token, userBody) => {
    const hashedToken = helperFunction.hashToken(token);
    const user = await prisma.auth.findUnique({
        where: {
            resetPasswordToken: hashedToken,
            resetPasswordExpiresAt: {gt: new Date()}
        }
    });

    if(!user) throw new ApiError(403, "Invalid or Expired reset token");

    const newPassword = await helperFunction.hashPassword(userBody.password);

    await prisma.auth.update({
        where: {id: user.id},
        data: {
            password: newPassword,
            resetPasswordToken: undefined,
            resetPasswordExpiresAt: undefined
        }
    });

    return {email: user.email, userId: user.id};
}

const changePassword = async(userId, userBody) => {
    const user = await prisma.auth.findUnique({
        where: {id: userId}
    })

    const oldPasswordMatching = await helperFunction.comparePassword(userBody.password, user.password);
    if(!oldPasswordMatching) throw new ApiError(401, "Invalid password.");
    
    const newPassword = await helperFunction.hashPassword(userBody.newPassword)

    await prisma.auth.update({
        where: {id: user.id},
        data: {
            password: newPassword
        }
    });

    return {email: user.email, userId: user.id};
}

export const authService = {
    createAccount,
    verifyOtp,
    validateCredentials,
    login,
    getUserById,
    getUser,
    logout,
    forgetPassword,
    resetPassword,
    changePassword
}