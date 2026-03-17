const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/orderController');

router.post('/', auth, ctrl.createOrder);
router.get('/', auth, ctrl.listOrders);
router.patch('/:id/confirm', auth, ctrl.confirmOrder);

module.exports = router;
