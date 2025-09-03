import { Page } from "../../infrastructure/models/page.model.js";

import { ApiError } from "../../../../../shared/utils/ApiError.js";

import { getUserId } from "../../infrastructure/external/userService.js";
import { getWorkspaceIdAndRole } from "../../infrastructure/external/workspaceService.js";
import logger from "../../../../../shared/utils/logger.js";

const createPersonalPage = async (authId, title) => {
    const user = await getUserId(authId);

    if(!user) throw new ApiError(403, "Invalid request");

    let page;

    page = new Page ({
        title,
        workspaceId: null,
        userId: user.id
    });
    await page.save();

    return {
        id: page._id,
        title: page.title,
        userId: page.userId,
        workspaceId: null
    }
}

const ALLOWED_ROLES = ["OWNER", "ADMIN", "MEMBER"]

const createTeamPage = async (authId, title) => {
    const workspaceData = await getWorkspaceIdAndRole(authId)

    const {workspaceId, role, userId} = workspaceData

    if(!ALLOWED_ROLES.includes(role)){
        throw new ApiError(403, "User does not have permission to create pages in this workspace");
    }

    
    const page = new Page ({
        title,
        workspaceId,
        userId
    });
    await page.save();
    

    return {
        id: page._id,
        title: page.title,
        workspace_id: workspaceId,
        userId: page.userId
    }
}


const updatePage = async (pageId, title) => {
    try {
        const page = await Page.findByIdAndUpdate(
            pageId, 
            {$set: title},
            {new: true, runValidators: true}
        )

        return {
            id: page._id,
            title: page.title,
            workspace_id: workspaceId || null,
            userId: page.userId
        }

    } catch (error) {
        logger.error("Error while updating page", {message: error.message, stack: error.stack});
        throw new ApiError(500, "Error while updating page", {message: error.message})
    }
}

const deletePage = async (pageId) => {
    await Page.findByIdAndDelete(pageId)
}


export const pageService = {
    createPersonalPage,
    createTeamPage,
    updatePage,
    deletePage
}