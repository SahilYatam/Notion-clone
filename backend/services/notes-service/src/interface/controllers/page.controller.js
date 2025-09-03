import { ApiError } from "../../../../../shared/utils/ApiError.js";
import { ApiResponse } from "../../../../../shared/utils/ApiResponse.js";
import { asyncHandler } from "../../../../../shared/utils/asyncHandler.js";

import { pageService } from "../../domain/services/page.service.js";

const createPersonalPage = asyncHandler(async (req, res) => {
  const authId = req.user?.id;
  const page = await pageService.createPersonalPage(authId, req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, { page }, "Page created successfully"));
});

const createTeamPage = asyncHandler(async (req, res) => {
  const authId = req.user?.id;

  const page = await pageService.createTeamPage(authId, req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, { page }, "Page created successfully"));
});

const updatePage = asyncHandler(async (req, res) => {
  const { pageId } = req.params;

  const page = await pageService.updatePage(pageId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, { page }, "Page updated successfully"));
});

const deletePage = asyncHandler(async (req, res) => {
  const { pageId } = req.params;

  await pageService.deletePage(pageId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Page deleted successfully"));
});

export const pageController = {
  createPersonalPage,
  createTeamPage,
  updatePage,
  deletePage
};
