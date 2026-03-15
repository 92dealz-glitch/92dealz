const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const vendorCtrl = require('../controllers/vendorController');

router.get('/stats', auth, vendorCtrl.stats);
router.get('/analytics/weekly', auth, vendorCtrl.analyticsWeekly);

module.exports = router;
