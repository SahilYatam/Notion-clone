import { sessionService } from "../../domain/services/session.service.js";
import { setCookies } from "../../infrastructure/auth/cookie.service.js";

export const handleRefreshToken = async(req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        
        const {accessToken, rawRefreshToken} = await sessionService.refreshAccessToken(refreshToken);

        setCookies(res, accessToken, rawRefreshToken);
        return res.status(200).json({message: "Token refreshed successfully"});
    } catch (error) {
        next(error);
    }
}

export const getUserSessions = async(req, res) => {
    const userId = req.user?.id;
    const session = await sessionService.getUserSessions(userId);

    return res.status(200).json(session, {message: "Session fetch successfull"})
}
