import {Router} from "express"
import { validateRequest } from "../../middlewares/validate.middleware.js";
import { sessionValidation } from "../../domain/validators/session.validation.js";
import { authentication } from "../../middlewares/auth.middleware.js";
import { handleRefreshToken, getUserSessions } from "../controllers/session.controller.js";

const router = Router();

router.post("/refresh-token", validateRequest(sessionValidation.refreshTokenSchema), handleRefreshToken);

router.get("/get-user-sessions", authentication, getUserSessions);

export default router
