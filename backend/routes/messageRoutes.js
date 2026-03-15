const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/messageController');

router.post('/', auth, ctrl.send);
router.get('/threads', auth, ctrl.threads);
router.get('/thread', auth, ctrl.threadDetail);

module.exports = router;

