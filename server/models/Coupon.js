const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    festivalName: {
        type: String,
        required: true
    },
    discountPercentage: {
        type: Number,
        required: true,
        default: 10
    },
    validFrom: {
        type: Date,
        required: true
    },
    validUntil: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    message: {
        type: String,
        default: "Festival Offer"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Coupon', couponSchema);
