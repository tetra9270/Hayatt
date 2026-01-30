const express = require('express');
const router = express.Router();
const { checkAndGenerateCoupons, getActiveCoupons, validateCoupon } = require('../controllers/couponController');
const { protect } = require('../middleware/authMiddleware');

// Public/Protected Routes
router.get('/active', protect, getActiveCoupons);
router.post('/validate', protect, validateCoupon);
router.post('/sync', protect, checkAndGenerateCoupons); // Manually trigger sync (admin or init)

module.exports = router;
