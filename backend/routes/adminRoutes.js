const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const ctrl = require('../controllers/adminController');
const analytics = require('../controllers/analyticsController');

// Protect all admin routes
router.use(auth, admin);

// Deals
router.get('/deals', ctrl.getDeals);
router.post('/deals', ctrl.createDeal);
router.put('/deals/:id', ctrl.updateDeal);
router.delete('/deals/:id', ctrl.deleteDeal);

// Categories
router.get('/categories', ctrl.getCategories);
router.post('/categories', ctrl.createCategory);
router.put('/categories/:id', ctrl.updateCategory);
router.delete('/categories/:id', ctrl.deleteCategory);

// Stores
router.get('/stores', ctrl.getStores);
router.post('/stores', ctrl.createStore);
router.put('/stores/:id', ctrl.updateStore);
router.delete('/stores/:id', ctrl.deleteStore);

// Submissions
router.get('/submissions', ctrl.getSubmissions);
router.put('/submissions/:id', ctrl.updateSubmission);

// Analytics
router.get('/analytics/summary', analytics.summary);
router.get('/analytics/top-deals', analytics.topDeals);
router.get('/analytics/clicks-by-day', analytics.clicksByDay);

// Vendors
router.get('/vendors', ctrl.getVendors);
router.put('/vendors/:id/status', ctrl.updateVendorStatus);
router.post('/vendors', ctrl.createVendor);
router.delete('/vendors/:id', ctrl.deleteVendor);

module.exports = router;
