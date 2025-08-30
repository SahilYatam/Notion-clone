import { Router } from "express";
import { workspaceController } from "../controllers/workspace.controller.js";
import {verifyToken} from "../../../../../shared/Infrastrcuter/middleware/verifyToken.middleware.js"

import { validateRequest } from "../../../../../shared/Infrastrcuter/middleware/validation.middleware.js";

import { workspaceValidation } from "../../domain/validators/workspace.validation.js";

const router = Router();

router.post("/", validateRequest(workspaceValidation.createWorkspaceSchema), verifyToken, workspaceController.createWorkspace);

router.patch("/update-workspace", validateRequest(workspaceValidation.updateWorkspaceSchema), verifyToken, workspaceController.updateWorkspace)

router.delete("/delete-workspace", validateRequest(workspaceValidation.deleteWorkspaceSchema), verifyToken, workspaceController.deleteWorkspace)

router.post("/invite-user", validateRequest(workspaceValidation.inviteUserToWorkspaceSchema), verifyToken, workspaceController.inviteUserToWorkspace)

router.delete("/remove-user/:userId", validateRequest(workspaceValidation.removeUserFromWorkspaceSchema), verifyToken, workspaceController.removeUserFromWorkspace)

router.patch("/update-user-role", validateRequest(workspaceValidation.updateUserRoleSchema), verifyToken, workspaceController.updateUserRole)

router.get("/user-role", validateRequest(workspaceValidation.getUserRoleSchema), verifyToken, workspaceController.getUserRole)

router.get("/workspace-id", verifyToken, workspaceController.getWorkspaceId)

export default router
