import {Router} from "express"
import { validateRequest } from "../../middlewares/validate.middleware.js";
import { sessionService } from "../../domain/services/session.service.js";
import { sessionValidation } from "../../domain/validators/session.validation.js";

const router = Router();

router.post("/refresh-token", validateRequest(sessionValidation.refreshTokenSchema), sessionService.refreshAccessToken);

export default router
