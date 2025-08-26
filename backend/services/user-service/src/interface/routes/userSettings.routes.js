import { settingController } from "../controller/userSettings.controller.js";
import {verifyToken} from "../../../../../shared/Infrastrcuter/middleware/verifyToken.middleware.js"
import Router from "express"

import { validateRequest } from "../../../../../shared/Infrastrcuter/middleware/validation.middleware.js";

import { updateUserPreferenceSchema, getUserPreferenceSchema } from "../../domain/validators/userSettings.validation.js"

const router = Router();

router.patch("/update-prefrence", validateRequest(updateUserPreferenceSchema), verifyToken, settingController.updateUserPrefrence);

router.get("/prefrence", validateRequest(getUserPreferenceSchema), verifyToken, settingController.getUserPrefrence);

export default router;