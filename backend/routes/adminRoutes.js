const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const staff = require('../middleware/staffMiddleware');
const ctrl = require('../controllers/adminController');
const analytics = require('../controllers/analyticsController');

// Authentication required for all admin routes
router.use(auth);

// Deals
// Deals - Staff Access
router.get('/deals', staff, ctrl.getDeals);
router.post('/deals', staff, ctrl.createDeal);
router.put('/deals/:id', staff, ctrl.updateDeal);
router.delete('/deals/:id', staff, ctrl.deleteDeal);
router.put('/deals/:id/approve', staff, ctrl.approveDeal);
router.put('/deals/:id/reject', staff, ctrl.rejectDeal);
router.put('/deals/:id/pending', staff, ctrl.setPendingDeal);

// Categories
// Categories - Admin Only
router.get('/categories', admin, ctrl.getCategories);
router.post('/categories', admin, ctrl.createCategory);
router.put('/categories/:id', admin, ctrl.updateCategory);
router.delete('/categories/:id', admin, ctrl.deleteCategory);

// Stores
// Stores - Admin Only
router.get('/stores', admin, ctrl.getStores);
router.post('/stores', admin, ctrl.createStore);
router.put('/stores/:id', admin, ctrl.updateStore);
router.delete('/stores/:id', admin, ctrl.deleteStore);

// Submissions
// Submissions - Staff Access
router.get('/submissions', staff, ctrl.getSubmissions);
router.put('/submissions/:id', staff, ctrl.updateSubmission);

// Analytics
// Analytics - Admin Only
router.get('/analytics/summary', admin, analytics.summary);
router.get('/analytics/top-deals', admin, analytics.topDeals);
router.get('/analytics/clicks-by-day', admin, analytics.clicksByDay);

// Vendors
// Vendors - Staff Access
router.get('/vendors', staff, ctrl.getVendors);
router.post('/vendors', staff, ctrl.createVendor);
router.put('/vendors/:id/status', staff, ctrl.updateVendorStatus);
router.delete('/vendors/:id', admin, ctrl.deleteVendor);

// Verification
// Verification - Staff Access
router.get('/verifications', staff, ctrl.getVerificationRequests);
router.put('/verifications/:id/review', staff, ctrl.reviewVerification);

// Reports
// Reports - Staff Access
const reportCtrl = require('../controllers/reportController');
router.get('/reports', staff, reportCtrl.getReports);
router.put('/reports/:id', staff, reportCtrl.updateReportStatus);

// Reviews
// Reviews - Staff Access
const reviewCtrl = require('../controllers/reviewController');
router.delete('/reviews/:id', staff, reviewCtrl.deleteReviewAdmin);
// Staff
// Staff - Admin Only
const staffCtrl = require('../controllers/staffController');
router.get('/staff', admin, staffCtrl.getAllStaff);
router.post('/staff', admin, staffCtrl.createStaff);
router.put('/staff/:id', admin, staffCtrl.updateStaff);
router.delete('/staff/:id', admin, staffCtrl.deleteStaff);

module.exports = router;
