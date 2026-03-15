const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const controller = require('../controllers/alertController');

router.post('/', auth, controller.create);
router.get('/', auth, controller.list);
router.delete('/:id', auth, controller.remove);

module.exports = router;
