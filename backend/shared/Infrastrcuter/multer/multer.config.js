import multer from "multer"
import path from "path"
import fs from "fs"
import { ApiError } from "../../utils/ApiError";


// Temprory upload folder
const uploadDir = path.join(process.cwd(), "temp/uploads");
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, {recursive: true});
}

// storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => 
        cb(null, Date.now() + "-" + file.originalname),
});

// file filter images only
const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith("image/")) cb(null, true);
    else {
        cb(new ApiError(400, "Only image files are allowed"), false)
    }
}

export const multerUpload = multer({
    storage,
    fileFilter,
    limits: {fieldSize: 5 * 1024 * 1024} // 5MB max
})
