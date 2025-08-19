import { userController } from "../controller/user.controller.js";
import {verifyToken} from "../../../../../shared/Infrastrcuter/middleware/verifyToken.middleware.js"
import Router from "express"

const router = Router();

router.post("/", verifyToken, userController.createUserProfile);

router.patch("/update-profile", verifyToken, userController.updateUserProfile);

router.get("/profile", verifyToken, userController.getUserProfile);

router.delete("/delete-profile", verifyToken, userController.deleteUserProfile);

export default router;