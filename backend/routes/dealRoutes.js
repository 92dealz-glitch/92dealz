const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const controller = require('../controllers/dealController');
const qController = require('../controllers/dealsQueryController');
const clickController = require('../controllers/clickController');
const { createRateLimiter } = require('../middleware/rateLimit');
const clickLimiter = createRateLimiter({ windowMs: 60_000, max: 30 });

// Public listing and query features
router.get('/', qController.list);
router.get('/trending', qController.trending);
router.get('/ending-soon', qController.endingSoon);
router.get('/new', qController.newest);
router.get('/:id', qController.getById);
router.post('/:id/click', clickLimiter, clickController.record);

// Auth-required mutations using raw SQL with ownership
router.post('/', auth, qController.create);
router.put('/:id', auth, qController.update);
router.delete('/:id', auth, qController.remove);

module.exports = router;
