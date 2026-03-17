const express = require('express');
const { storage } = require('../config/cloudinary');
const multer = require('multer');
const auth = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ storage });

router.post('/image', auth, upload.single('image'), (req, res) => {
  if (!req.file) {
    console.error('[Upload] No file provided in request');
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  console.log('[Upload] Success:', req.file.path);
  // Cloudinary returns the absolute URL in req.file.path
  return res.status(201).json({ success: true, url: req.file.path });
});


module.exports = router;

