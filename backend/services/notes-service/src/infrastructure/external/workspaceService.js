import axios from "axios"

export const getWorkspaceIdAndRole = async (authId) => {
  try {
    const res = axios.get(`${process.env.WORKSPACE_URL}/workspace-id/${authId}`)

    return res.data.data.user;
  } catch (error) {
    logger.error("Error while fetching user ID from getUserID API", {
      message: error.message,
      stack: error.stack,
    });
    throw new ApiError(500, "Error while fetching user ID", {
      message: error.message,
      stack: error.stack,
    });
  }
};