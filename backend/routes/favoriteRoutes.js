const express = require('express');
const router = express.Router();
const controller = require('../controllers/favoriteController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, controller.create);
router.get('/', auth, controller.list);
router.delete('/:dealId', auth, controller.remove);

module.exports = router;
