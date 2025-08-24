import { Router } from "express";
import { workspaceController } from "../controllers/workspace.controller.js";
import {verifyToken} from "../../../../../shared/Infrastrcuter/middleware/verifyToken.middleware.js"

const router = Router();

router.post("/", verifyToken, workspaceController.createWorkspace);

router.patch("/update-workspace", verifyToken, workspaceController.updateWorkspace)

router.delete("/delete-workspace", verifyToken, workspaceController.deleteWorkspace)

router.post("/invite-user", verifyToken, workspaceController.inviteUserToWorkspace)

router.delete("/remove-user/:userId", verifyToken, workspaceController.removeUserFromWorkspace)

router.patch("/update-user-role", verifyToken, workspaceController.updateUserRole)

router.get("/user-role", verifyToken, workspaceController.getUserRole)

export default router
