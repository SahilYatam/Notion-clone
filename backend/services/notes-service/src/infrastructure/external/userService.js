import axios from "axios";

export const getUserId = async (authId) => {
  try {
    const res = await axios.get(`${process.env.USER_URL}/by-auth/${authId}`);

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
