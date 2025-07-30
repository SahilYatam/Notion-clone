import {Router} from "express"
import { authController } from "../controllers/auth.controller.js";
import { authentication } from "../../middlewares/auth.middleware.js";
import { validateRequest } from "../../middlewares/validate.middleware.js";
import { authValidate } from "../../domain/validators/auth.validation.js";

const router = Router();

router.post("/create-account", validateRequest(authValidate.creatAccountSchema), authController.creatAccount);

router.post("/verify-otp", validateRequest(authValidate.verifyOtpSchema), authController.verifyOtp);

router.post("/validate-credentials", validateRequest(authValidate.validateCredentialsSchema), authController.validateCredentials);

router.post("/login", validateRequest(authValidate.loginSchema), authController.login);

router.post("/logout", validateRequest(authValidate.logoutSchema), authentication, authController.logout);

router.post("/forget-password-request", validateRequest(authValidate.forgetPasswordSchema), authController.forgetPasswordRequest);

router.post("rest-password/:token", validateRequest(authValidate.resetPasswordSchema), authController.resetPassword);

router.post("/change-password", validateRequest(authValidate.changePasswordSchema), authController.changePassword);

router.get("/user-profile", authentication, authController.getUser);

export default router;