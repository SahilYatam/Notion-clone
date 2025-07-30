import { sessionService } from "../../domain/services/session.service.js";
import { setCookies } from "../../infrastructure/auth/cookie.service.js";

export const handleRefreshToken = async(req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken
        const {accessToken, rawRefreshToken} = await sessionService.refreshAccessToken(res,refreshToken);

        setCookies(res, accessToken, rawRefreshToken);
        return res.status(200).json({message: "Token refreshed successfully"});
    } catch (error) {
        next(error);
    }
}
