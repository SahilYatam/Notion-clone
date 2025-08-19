import { prisma } from "../../infrastructure/db/db.js";
import { ApiError } from "../../../../../shared/utils/ApiError.js";

const createUserProfile = async (id, userBody) => {
  const profile = await prisma.user.create({
    data: {
      authId: id,
      avatarUrl: userBody.avatarUrl || null,
      role: userBody.role || "USER",
      settings: {
        create: {}
      }
    },
  });

  return profile;
};

const updateUserProfile = async (id, data) => {
    try {
        const updatedName = await prisma.user.update({
            where: { authId: id },
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


const getUserProfile = async(id) => {
    const user = await prisma.user.findUnique({
        where: {authId: id}
    })

    if(!user){
        throw new ApiError(404, "User not found");
    }

    return user;
}

const deleteUserProfile = async(id) => {
    const deletedUser = await prisma.user.delete({
        where: {authId: id}
    });

    return deletedUser;
}

export const userService = {
  createUserProfile,
  updateUserProfile,
  getUserProfile,
  deleteUserProfile
};
