const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const controller = require('../controllers/submissionController');

router.post('/', auth, controller.create);
router.get('/', auth, controller.listMine);

module.exports = router;
