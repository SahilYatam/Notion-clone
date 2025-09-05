import { authService } from "../../domain/services/auth.service.js";
import { sessionService } from "../../domain/services/session.service.js";
import { emailService } from "../../infrastructure/email/email.service.js";

import { ApiError } from "../../../../../shared/utils/ApiError.js";
import { ApiResponse } from "../../../../../shared/utils/ApiResponse.js";
import { asyncHandler } from "../../../../../shared/utils/asyncHandler.js";

import { generateTokens, generateEmailToken } from "../../domain/services/jwt.service.js";
import { clearCookies, setCookies, setEmailCookie } from "../../domain/services/cookie.service.js";
import logger from "../../../../../shared/utils/logger.js";


const createAccount = asyncHandler(async(req, res) => {
    const user = await authService.createAccount(req.body);

    const emailToken = generateEmailToken(user.email)
    setEmailCookie(res, emailToken)

    emailService.sendVerifyEmail(user.email, user.userOtp)
    .catch(err => logger.error('Email sending failed:', err))

    return res.status(200).json(new ApiResponse(200, {email: user.email, message: "OTP sent to your email"}, "OTP sent successfully"));
});

const verifyOtp = asyncHandler(async(req, res) => {
    const emailToken = req.cookies.emailToken
    if(!emailToken) throw new ApiError(401, "Email verification token not found");

    const user = await authService.verifyOtp(req.body, emailToken);
    const {accessToken, refreshToken, refreshTokenExpiry} = generateTokens(user.userId);

    const ip = await sessionService.getClientIp(req)
    const userAgent = req.headers["user-agent"] || "unknown"

    await sessionService.createSession(user.userId, refreshToken, ip, userAgent, refreshTokenExpiry);

    setCookies(res, accessToken, refreshToken);

    return res.status(200).json(new ApiResponse(200, {user: {
        email: user.email, onboardingStatus: user.onboarding
    }}, "Email verified successfully"));
});

const validateCredentials = asyncHandler(async(req, res) => {
    const userId = req.user?.id;
    const {name, password} = req.body;

    const user = await authService.validateCredentials(userId, {name, password});
    
    return res.status(200).json(new ApiResponse(200, {user}, "Name and Password added successfully"));
});

const login = asyncHandler(async(req, res) => {
    const user = await authService.login(req.body);
    const {accessToken, refreshToken, refreshTokenExpiry} = generateTokens(user.id)

    const ip = await sessionService.getClientIp(req)
    const userAgent = req.headers["user-agent"] || "unknown"

    await sessionService.createSession(user.id, refreshToken, ip, userAgent, refreshTokenExpiry);

    setCookies(res, accessToken, refreshToken);

    return res.status(200).json(new ApiResponse(200, {user}, "Login successfully"));
});

const getUser = asyncHandler(async(req, res) => {
    const userId = req.user?.id
    if(!userId) throw new ApiError(401, "User does not exist");
    const user = await authService.getUser(userId);
    
    return res.status(200).json(new ApiResponse(200, {user}, "User fetched successfully"));
});

const getUserByEmail = asyncHandler(async(req, res) => {
    const { email } = req.query;

    if(!email) throw new ApiError(400, "Email is required");

    const user = await authService.getUserByEmail(email);

    return res.status(200).json(new ApiResponse(200, {user}, "User email id"));
})

const logout = asyncHandler(async(req, res) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    await authService.logout(refreshToken);

    clearCookies(res, accessToken, refreshToken);

    return res.status(200).json(new ApiResponse(200, {}, "User logout successfully"));
});

const forgetPasswordRequest = asyncHandler(async(req, res) => {
    const user = await authService.forgetPassword(req.body);

    await emailService.sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/password-rest/${user.rawToken}`);

    logger.info("Password reset link generated from this Id: ", { userId: user.userId });
    return res.status(200).json(new ApiResponse(200, {}, "Password reset link sent to your email."))
});

const resetPassword = asyncHandler(async(req, res) => {
    const token = req.params;

    const user = await authService.resetPassword(token, req.body);

    logger.info("Password reset successful from this Id: ", { userId: user.userId });
    return res.status(200).json(new ApiResponse(200, {}, "Password reset successfull"));
});

const changePassword = asyncHandler(async(req, res) => {
    const userId = req.user?.id
    const user = await authService.changePassword(userId, req.body);

    logger.info("Password changed successfully from this Id: ", { userId: user.userId });
    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

export const authController = {
    createAccount,
    verifyOtp,
    validateCredentials,
    login,
    getUser,
    getUserByEmail,
    logout,
    forgetPasswordRequest,
    resetPassword,
    changePassword
}
