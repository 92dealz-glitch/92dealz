const express = require('express');
const multer = require('multer');
const auth = require('../middleware/authMiddleware');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const hasCloudinaryKeys = process.env.CLOUDINARY_CLOUD_NAME && 
                          process.env.CLOUDINARY_API_KEY && 
                          process.env.CLOUDINARY_API_SECRET;

let storage;
if (hasCloudinaryKeys) {
  storage = require('../config/cloudinary').storage;
} else {
  console.log('[Upload] Cloudinary keys missing in .env. Falling back to local disk storage.');
  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
}

const upload = multer({ 
  storage,
  limits: { fileSize: 3 * 1024 * 1024 } // 3MB limit
});

router.post('/image', auth, upload.single('image'), (req, res) => {
  if (!req.file) {
    console.error('[Upload] No file provided in request');
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  let fileUrl;
  if (hasCloudinaryKeys) {
    fileUrl = req.file.path; // Cloudinary returns absolute URL in req.file.path
  } else {
    // Return local static URL
    fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }

  console.log('[Upload] Success:', fileUrl);
  return res.status(201).json({ success: true, url: fileUrl });
});

module.exports = router;

