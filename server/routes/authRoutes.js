const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    addAddress,
    deleteAddress,
    sendOtp,
    verifyOtp
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/add-address', protect, addAddress);
router.delete('/address/:id', protect, deleteAddress);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/wishlist', protect, require('../controllers/authController').addToWishlist);
router.delete('/wishlist/:id', protect, require('../controllers/authController').removeFromWishlist);

module.exports = router;
