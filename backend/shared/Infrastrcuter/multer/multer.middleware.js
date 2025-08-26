import { multerUpload } from "./multer.config.js";

export const uploadSingleImage = multerUpload.single("avatar");
export const uploadMultipleImages = multerUpload.array("images", 5)