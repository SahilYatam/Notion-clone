import { prisma } from "../../infrastructure/db/db.js";
import { ApiError } from "../../../../../shared/utils/ApiError.js";

const createUserProfile = async (authId, userBody) => {
  const profile = await prisma.user.create({
    data: {
      authId,
      avatarUrl: userBody.avatarUrl || null,
      role: userBody.role || "USER",
      settings: {
        create: {}
      }
    },
  });

  return profile;
};

const selectWorkspaceType = async (authId, type) => {
    
    if(!["PERSONAL", "TEAM"].includes(type)) {
        throw new ApiError(400, "Invalid workspace type")
    }

     try {
        const user = await prisma.user.update({
            where: { authId },
            data: { workspaceType: type }
        });

        return { selectedWorkspaceType: user.workspaceType };
    } catch (error) {
        if (error.code === "P2025") { // Prisma "Record not found"
            throw new ApiError(404, "User not found");
        }
        throw new ApiError(500, "Error updating workspace type", { message: error.message });
    }
}

const updateUserProfile = async (authId, data) => {
    try {
        const updatedName = await prisma.user.update({
            where: { authId },
            data
        });
        return updatedName;
    } catch (error) {
        if (error.code === "P2025") {
            throw new ApiError(404, "User not found");
        }
        throw error;
    }
};


const getUserProfile = async(authId) => {
    const user = await prisma.user.findUnique({
        where: {authId},
        select: {
            id: true,
            name: true,
            avatarUrl: true,
        }
    })

    if(!user){
        throw new ApiError(404, "User not found");
    }

    return user;
}

const getUserById = async(authId) => {
    const user = await prisma.user.findUnique({
        where: {authId},
        select: {id: true}
    });

    if(!user){
        throw new ApiError(404, "User not found");
    }

    return user;
}

const deleteUserProfile = async(authId) => {
    const deletedUser = await prisma.user.delete({
        where: {authId}
    });

    return deletedUser;
}

export const userService = {
  createUserProfile,
  selectWorkspaceType,
  updateUserProfile,
  getUserProfile,
  getUserById,
  deleteUserProfile
};
