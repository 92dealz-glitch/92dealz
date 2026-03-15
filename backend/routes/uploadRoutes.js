const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname || '');
    const base = path.basename(file.originalname || 'image', ext).replace(/\s+/g, '-').slice(0, 32);
    const name = `${Date.now()}-${base}${ext || '.png'}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

router.post('/image', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const urlPath = `/uploads/${req.file.filename}`;
  return res.status(201).json({ success: true, url: urlPath });
});

module.exports = router;

