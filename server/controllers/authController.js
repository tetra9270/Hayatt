const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendEmail } = require('../utils/emailService');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                addresses: user.addresses,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                addresses: user.addresses,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

// @desc    Add Address
// @route   POST /api/auth/add-address
// @access  Private
const addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.addresses.push(req.body);
            const updatedUser = await user.save();
            res.json(updatedUser.addresses);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove Address
// @route   DELETE /api/auth/address/:id
// @access  Private
const deleteAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.addresses = user.addresses.filter(
                (addr) => addr._id.toString() !== req.params.id
            );
            await user.save();
            res.json(user.addresses);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send OTP to email
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email required" });

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Save to DB (expires in 10 minutes)
        await OTP.create({
            email,
            otp: otpCode,
            expiresAt: Date.now() + 10 * 60 * 1000
        });

        // Send Email
        const message = `Your One-Time Password (OTP) for Hayatt Store is: ${otpCode}\n\nThis code expires in 10 minutes.`;
        await sendEmail({
            email,
            subject: 'Hayatt Store Authentication Code',
            message
        });

        res.status(200).json({ success: true, message: 'OTP sent to email' });

    } catch (error) {
        console.error("OTP Error:", error);
        res.status(500).json({ message: "Failed to send OTP", error: error.message });
    }
};

// @desc    Verify OTP and Login/Signup
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Check if OTP exists and is valid
        const validOtp = await OTP.findOne({ email, otp });
        if (!validOtp) {
            return res.status(400).json({ message: "Invalid or Expired OTP" });
        }

        // OTP is valid, find or create user
        let user = await User.findOne({ email });

        if (!user) {
            // Create user with random password if new
            const randomPassword = Math.random().toString(36).slice(-8);
            const name = email.split('@')[0]; // Default name from email
            user = await User.create({
                name,
                email,
                password: randomPassword
            });
        }

        // Delete used OTP
        await OTP.deleteOne({ _id: validOtp._id });

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            addresses: user.addresses,
            token: generateToken(user._id)
        });

    } catch (error) {
        console.error("Verify OTP Error:", error);
        res.status(500).json({ message: "Verification failed" });
    }
};

// @desc    Add to Wishlist
// @route   POST /api/auth/wishlist
// @access  Private
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user.id);
        if (user) {
            if (!user.wishlist.includes(productId)) {
                user.wishlist.push(productId);
                await user.save();
            }
            res.json(user.wishlist);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove from Wishlist
// @route   DELETE /api/auth/wishlist/:id
// @access  Private
const removeFromWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.wishlist = user.wishlist.filter(id => id !== req.params.id);
            await user.save();
            res.json(user.wishlist);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    addAddress,
    deleteAddress,
    sendOtp,
    verifyOtp,
    addToWishlist,
    removeFromWishlist
};
