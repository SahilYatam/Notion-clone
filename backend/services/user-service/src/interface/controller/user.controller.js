import { ApiResponse } from "../../../../../shared/utils/ApiResponse.js";
import { asyncHandler } from "../../../../../shared/utils/asyncHandler.js";

import { userService } from "../../domain/services/user.service.js";

const createUserProfile = asyncHandler(async(req, res) => {
    const id = req.user?.id
    const profile = await userService.createUserProfile(id, req.body);
    return res.status(200).json(new ApiResponse(200, {profile}, "User profile created!"))
});

const selectWorkspaceType = asyncHandler(async (req, res) => {
    const id = req.user.id;
    const selectedType = await userService.selectWorkspaceType(id, req.body);
    return res.status(200).json(new ApiResponse(200, {selectedType}, "Workspace type selected!"))
})

const updateUserProfile = asyncHandler(async(req, res) => {
    const id = req.user?.id
    const updatedUser = await userService.updateUserProfile(id, req.body);
    return res.status(200).json(new ApiResponse(200, {updatedUser}, "User profile updated!"))
});

const getUserProfile = asyncHandler(async(req, res) => {
    const id = req.user?.id
    const user = await userService.getUserProfile(id);
    return res.status(200).json(new ApiResponse(200, {user}, "User profile fetched!"));
});

const getUserById = asyncHandler(async(req, res) => {
    const {authId} = req.params;
    const user = await userService.getUserById(authId);
    return res.status(200).json(new ApiResponse(200, {user}, "User ID fetched!"));
})

const deleteUserProfile = asyncHandler(async(req, res) => {
    const id = req.user?.id
    await userService.deleteUserProfile(id);
    return res.status(200).json(new ApiResponse(200, {}, "User profile deleted!"));
})

export const userController = {
    createUserProfile,
    selectWorkspaceType,
    updateUserProfile,
    getUserProfile,
    getUserById,
    deleteUserProfile
}