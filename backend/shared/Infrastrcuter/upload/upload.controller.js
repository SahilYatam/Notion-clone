import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import logger from "../../utils/logger.js";
import { uploadToCloudinary } from "../cloudinary/cloudinary.utils.js";

// avatar upload controller
export const uploadAvatar = async(req, res, next) => {
    try {
        if(!req.file){
            throw new ApiError(400, "No file uploaded")
        }
        const result = await uploadToCloudinary(req.file.path, "avatars");

        return res.status(200).json(new ApiResponse(200, {
            url: result.secure_url,
            public_id: result.public_id,
        }, "Avatar uploaded successfully"));
    } catch (error) {
        next(error);
        logger.error("Error uploading avatar image", {message: error.message, stack: error.stack})
        throw new ApiError(500, "Error uploading avatar image")
    }
}

// multiple images controller for notes service

export const uploadNoteImages = async(req, res, next) => {
    try {
        if(!req.files || req.files.length === 0) {
            throw new ApiError(400, "No images uploaded");
        }

        const uploads = await Promise.all(
            req.files.map((file) => uploadToCloudinary(file.path, "notes"))
        )

        return res.status(200).json(new ApiResponse(200, {
            url: uploads.map((u) => u.secure_url),
        }, "Images uploaded successfully"));

    } catch (error) {
        next(error);
        logger.error("Error uploading notes image", {message: error.message, stack: error.stack})
        throw new ApiError(500, "Error uploading notes image")
    }
}
