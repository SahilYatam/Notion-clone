import { userController } from "../controller/user.controller.js";
import { verifyToken } from "../../../../../shared/Infrastrcuter/middleware/verifyToken.middleware.js";
import Router from "express";

import { validateRequest } from "../../../../../shared/Infrastrcuter/middleware/validation.middleware.js";

import { userValidation } from "../../domain/validators/user.validation.js";

import { uploadSingleImage } from "../../../../../shared/Infrastrcuter/multer/multer.middleware.js";
import { uploadAvatar } from "../../../../../shared/Infrastrcuter/upload/upload.controller.js";

const router = Router();

router.post(
  "/",
  verifyToken,
  validateRequest(userValidation.createUserProfileSchema),
  userController.createUserProfile,
  uploadSingleImage,
  uploadAvatar
);

router.post(
  "/select-wrokspace-type",
  verifyToken,
  validateRequest(userValidation.selectWorkspaceTypeSchema),
  userController.selectWorkspaceType
);

router.patch(
  "/update-profile",
  validateRequest(userValidation.updateUserProfileSchema),
  verifyToken,
  userController.updateUserProfile
);

router.get(
  "/profile",
  validateRequest(userValidation.getUserProfileSchema),
  verifyToken,
  userController.getUserProfile
);

router.get(
  "/by-auth/:authId",
  validateRequest(userValidation.getUserByIdSchema),
  verifyToken,
  userController.getUserById
);

router.delete(
  "/delete-profile",
  validateRequest(userValidation.deleteUserProfileSchema),
  verifyToken,
  userController.deleteUserProfile
);

export default router;
