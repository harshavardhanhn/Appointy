import multer from "multer";
import fs from 'fs'
import path from 'path'

const uploadDir = path.join(process.cwd(), 'backend', 'uploads')

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, callback) {
        // Prevent path traversal by extracting just the base name
        const safeName = path.basename(file.originalname);
        callback(null, `${Date.now()}-${safeName}`)
    }
});

const fileFilter = (req, file, cb) => {
    // Only allow images
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP are allowed.'), false);
    }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }) // 5MB limit

export default upload