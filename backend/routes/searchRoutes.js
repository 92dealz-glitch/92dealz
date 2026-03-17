const express = require('express');
const router = express.Router();
const controller = require('../controllers/searchController');

router.get('/', controller.search);
router.get('/suggestions', controller.suggestions);

module.exports = router;
