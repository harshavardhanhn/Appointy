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
        callback(null, `${Date.now()}-${file.originalname}`)
    }
});

const upload = multer({ storage })

export default upload