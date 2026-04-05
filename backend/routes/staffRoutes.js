const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const staffCtrl = require('../controllers/staffController');

// Staff ping requires authentication
router.use(auth);

router.post('/ping', staffCtrl.pingStaff);

module.exports = router;
