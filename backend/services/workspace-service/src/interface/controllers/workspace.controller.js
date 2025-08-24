import { workspaceService } from "../../domain/services/workspace.service.js";
import { ApiResponse } from "../../../../../shared/utils/ApiResponse.js";
import { asyncHandler } from "../../../../../shared/utils/asyncHandler.js";

import { inviteUserToWorkspaceEmail } from "../../infrastructure/email/email.service.js";

const createWorkspace = asyncHandler(async (req, res) => {
  const id = req.user?.id;
  const workspace = await workspaceService.createWorkspace(id, req.body);
  return res
    .status(200)
    .json(
      new ApiResponse(200, { workspace }, "Workspace created successfully")
    );
});

const updateWorkspace = asyncHandler(async (req, res) => {
  const id = req.user?.id;
  const updatedWorkspace = await workspaceService.updateWorkspace(id, req.body);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedWorkspace },
        "Workspace updated successfully"
      )
    );
});

const deleteWorkspace = asyncHandler(async (req, res) => {
  const id = req.user?.id;
  const deletedWorkspace = await workspaceService.deleteWorkspace(id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedWorkspace },
        "Workspace deleted successfully"
      )
    );
});

const inviteUserToWorkspace = asyncHandler(async (req, res) => {
  const authId = req.user?.id;
  const { email, role } = req.body;

  const invite = await workspaceService.inviteUserToWorkspace(
    authId,
    email,
    role
  );

  await inviteUserToWorkspaceEmail(
    invite.userEmail,
    invite.workspaceName,
    invite.userRole,
    invite.inviteLink
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { invite }, "Invite sent successfully"));
});

const removeUserFromWorkspace = asyncHandler(async (req, res) => {
  const ownerId = req.user.id;
  const { userId } = req.query;

  await workspaceService.removeUserFromWorkspace(ownerId, userId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User removed from workspace"));
});

const updateUserRole = asyncHandler(async (req, res) => {
  const ownerAuthId = req.user.id;
  const { targetUserId, role } = req.body; // frontend sends this

  await workspaceService.updateUserRole(ownerAuthId, targetUserId, role);

  return res.status(200).json(new ApiResponse(200, {}, "User role updated"));
});

const getUserRole = asyncHandler(async (req, res) => {
  const ownerAuthId = req.user.id;
  const { targetUserId } = req.body;

  const role = await workspaceService.getUserRole(ownerAuthId, targetUserId);

  return res
    .status(200)
    .json(new ApiResponse(200, { role }, "User role fetched"));
});

export const workspaceController = {
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  inviteUserToWorkspace,
  removeUserFromWorkspace,
  updateUserRole,
  getUserRole,
};
