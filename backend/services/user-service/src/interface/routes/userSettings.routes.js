import { settingController } from "../controller/userSettings.controller.js";
import {verifyToken} from "../../../../../shared/Infrastrcuter/middleware/verifyToken.middleware.js"
import Router from "express"

const router = Router();

router.patch("/update-prefrence", verifyToken, settingController.updateUserPrefrence);

router.get("/prefrence", verifyToken, settingController.getUserPrefrence);

export default router;