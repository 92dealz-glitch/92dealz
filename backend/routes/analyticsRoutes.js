const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/analyticsController');

router.post('/view', ctrl.logView); // optional auth
router.post('/contact', auth, ctrl.logContact);

module.exports = router;

