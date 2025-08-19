import { prisma } from "../../infrastructure/db/db.js";

const updateUserPrefrence = async(id, prefs) => {
    const updatedPrefrence = await prisma.userSettings.update({
        where: {authId: id},
        data: prefs
    })
    return updatedPrefrence
}

const getUserPrefrence = async(authId) => {
    const prefrenceSettings = await prisma.userSettings.findUnique({
        where: {authId},
        select: {
            theme: true,
            emailNotifications: true,
        }
    })
    return prefrenceSettings
}

export const settingService = {
    updateUserPrefrence,
    getUserPrefrence
}