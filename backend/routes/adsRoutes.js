const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/adsController');

router.get('/', ctrl.listActive);
router.get('/vendor', auth, ctrl.listMine);
router.get('/:id', ctrl.getById);
router.post('/', auth, ctrl.create);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.remove);
router.patch('/:id/sold', auth, ctrl.markSold);

module.exports = router;
