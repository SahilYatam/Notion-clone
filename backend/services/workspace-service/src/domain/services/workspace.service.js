import {prisma} from "../../infrastructure/db/db.js"
import { ApiError } from "../../../../../shared/utils/ApiError.js";
import axios from "axios"
import { createToken } from "../../utils/inviteLinkToken.js";


const getUserId = async(authId) => {
    try {
        const res = await axios.get(`127.0.0.1:8001/api/v1/by-auth/${authId}`)

        if(res.status !== 200){
            throw new ApiError(400, "Error while fetching user ID")
        }else{
            return res.data.user
        }
        
    } catch (error) {
       throw new ApiError(500, "Error while fetching user ID", {message: error.message, stack: error.stack}) 
    }
}

const createWorkspace = async(authId, userBody) => {
    const user = await getUserId(authId)
    if(!user) throw new ApiError(400, "User does not exist");

    const workspace = await prisma.workspace.create({
        data: {
            name: userBody.name,
            description: userBody.description || null,
            ownerId: user.id
        }
    });

    return workspace
}

const getWorkspaceId = async(authId) => {
    const user = await getUserId(authId)
    if(!user) throw new ApiError(400, "User does not exist");

    const workspaceOwner = await prisma.workspace.findUnique({
        where: {ownerId: user.id},
        select: {
            id: true,
            ownerId: true
        }
    })

    if(!workspaceOwner) throw new ApiError(404, "Workspace not found!");

    return workspaceOwner
}

const updateWorkspace = async(authId, data) => {
    const user = await getUserId(authId);
    if(!user) throw new ApiError(400, "User does not exist");

    const workspaceId = await getWorkspaceId(user.id)
    const updatedWorkspace = await prisma.workspace.update({
        where: {id: workspaceId},
        data
    });

    return updatedWorkspace
}

const deleteWorkspace = async(authId) => {
    const user = await getUserId(authId);
    if(!user) throw new ApiError(400, "User does not exist");

    const workspace = await prisma.workspace.findFirst({
        where: {ownerId: user.id}
    });

    if(!workspace){
        throw new ApiError(403, "You are not the owner of this workspace")
    }

    const deletedWorkspace = await prisma.workspace.delete({
        where: {id: workspace.id}
    })

    return deletedWorkspace;
}

const getUserEmailFromAuth = async(email) => {
    try {
        const res = await axios.get("http://localhost:8000/api/v1/auth/user-email", { params: {email} });

        return res.data.user
    } catch (error) {
        if(error.response?.status === 404){
            throw new ApiError(404, "User with this email does not exist");
        } 

        throw new ApiError(400, "Error while fetching user email from auth");
    }
}

const inviteUserToWorkspace = async(authId, email, role) => {
    // get workspace owner id
    const owner = await getUserId(authId);
    const workspace = await getWorkspaceId(owner.id)

    // inviting user email 
    let targetUser = null;

    try {
        targetUser = await getUserEmailFromAuth(email)
    } catch (error) {
        targetUser = null
    }

    if(targetUser){
        // check if already a member
        const existingMember = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId: workspace.id,
                userId: targetUser.id
            }
        })

        if(existingMember){
            throw new ApiError(400, "User is already a member of this workspace");
        }
    }
    
    const token = createToken()
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48) // 48 hours

    // create invite
    const invite = await prisma.workspaceInvite.create({
        data: {
            workspaceId: workspace.id,
            email,
            role,
            token,
            expiresAt
        }
    })

    const inviteLink = `${process.env.FRONTEND_URL}/invite?token=${token}`;

    return {
        inviteId: invite.id,
        workspaceName: workspace.name,
        userEmail: email,
        userRole: role,
        inviteLink
    }

}

const removeUserFromWorkspace = async(authId, rmUserId) => {
    const user = await getUserId(authId)
    if(!user.id) throw new ApiError(400, "User does not exist");

    const workspaceId = await getWorkspaceId(user.id);

    if(!workspaceId) throw new ApiError(404, "Workspace not found");

    // remove the member
    const deletedUser = await prisma.workspaceMember.delete({
        where:{
            workspaceId_userId: {
                workspaceId: workspaceId.id,
                userId: rmUserId
            }
        }
    })

    return deletedUser
}

const updateUserRole = async (ownerAuthId, targetUserId, role) => {
    const owner = await getUserId(ownerAuthId);
    const workspaceId = await getWorkspaceId(owner.id);

    // verify the owner is part of workspace and he his admin
    const ownerMember = await prisma.workspaceMember.findFirst({
        where: {
            workspaceId, 
            userId: owner.id
        },
        select: { role: true }
    });

    if(!ownerMember) {
        throw new ApiError(403, "You are not a member of this workspace");
    }

    if(ownerMember.role !== "OWNER" && ownerMember.role !== "ADMIN"){
        throw new ApiError(403, "You don't have permission to update roles")
    }

    // update target user role
    const updatedMember = await prisma.workspaceMember.updateMany({
        where: {workspaceId, userId: targetUserId},
        data: { role }
    });

    if(updatedMember.count === 0){
        throw new ApiError(404, "Target user not found in this workspace")
    }

    return updatedMember;
}

const getUserRole = async(ownerAuthId, targetUserId) => {
    const owner = await getUserId(ownerAuthId)

    const workspaceId = await getWorkspaceId(owner.id);

    // check the target user's role in this workspace
    const userMember = await prisma.workspaceMember.findFirst({
        where: {
            workspaceId,
            userId: targetUserId
        },
        select: {role: true}
    });

    if(!userMember){
        throw new ApiError(403, "User is not a memebr of this workspace");
    }

    return userMember.role;
}

export const workspaceService = {
    createWorkspace,
    getWorkspaceId,
    updateWorkspace,
    deleteWorkspace,
    inviteUserToWorkspace,
    removeUserFromWorkspace,
    updateUserRole,
    getUserRole
}

 