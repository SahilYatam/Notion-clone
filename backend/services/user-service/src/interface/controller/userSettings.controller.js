import { ApiResponse } from "../../../../../shared/utils/ApiResponse.js";
import { asyncHandler } from "../../../../../shared/utils/asyncHandler.js";

import { settingService } from "../../domain/services/userSettings.service.js";

const updateUserPrefrence = asyncHandler(async(req, res) => {
    const id = req.user?.id
    const updatedPrefrence = await settingService.updateUserPrefrence(id, req.body);
    return res.status(200).json(new ApiResponse(200, {updatedPrefrence}, "Settings updated successfully"));
})

const getUserPrefrence = asyncHandler(async(req, res) => {
    const id = req.user?.id
    const userPrfrence = await settingService.getUserPrefrence(id);
    return res.status(200).json(new ApiResponse(200, {userPrfrence}, "User prefrence fetched successfully"));
})

export const settingController = {
    updateUserPrefrence,
    getUserPrefrence
}