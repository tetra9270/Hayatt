const Coupon = require('../models/Coupon');

// Static Festival Calendar (Month is 0-indexed in JS Date: 0=Jan, 11=Dec)
const FESTIVALS = [
    { name: "New Year", month: 0, day: 1, code: "NEWYEAR25", discount: 15, msg: "Happy New Year! Start 2025 with style." },
    { name: "Valentine's Day", month: 1, day: 14, code: "LOVE20", discount: 20, msg: "Gift something special this Valentine's." },
    { name: "Eid Special", month: 3, day: 10, code: "EIDMUBARAK", discount: 25, msg: "Eid Mubarak! Celebrate with exclusive gear." }, // Approx for 2025
    { name: "Halloween", month: 9, day: 31, code: "SPOOKY15", discount: 15, msg: "Spooky seasonal savings!" },
    { name: "Diwali", month: 9, day: 20, code: "DIWALI30", discount: 30, msg: "Light up your world with this Diwali offer." }, // Approx
    { name: "Black Friday", month: 10, day: 29, code: "BLACKFRIDAY", discount: 50, msg: "Biggest sale of the year!" },
    { name: "Christmas", month: 11, day: 25, code: "SANTA25", discount: 25, msg: "Merry Christmas! Ho Ho Ho 🎅" }
];

// Check and Generate Coupons
exports.checkAndGenerateCoupons = async (req, res) => {
    try {
        const today = new Date();
        const currentYear = today.getFullYear();
        let generated = [];

        for (const festival of FESTIVALS) {
            // Create date object for this year's festival
            const festivalDate = new Date(currentYear, festival.month, festival.day);

            // Allow coupon generation 5 days before
            const startDate = new Date(festivalDate);
            startDate.setDate(festivalDate.getDate() - 5);

            // Expires 1 day after festival
            const endDate = new Date(festivalDate);
            endDate.setDate(festivalDate.getDate() + 1);

            // Logic: If TODAY is between [Festival - 5] and [Festival + 1]
            if (today >= startDate && today <= endDate) {
                // Check if coupon already exists
                const existing = await Coupon.findOne({ code: festival.code });
                if (!existing) {
                    console.log(`Generating Coupon for ${festival.name}`);
                    const newCoupon = await Coupon.create({
                        code: festival.code,
                        festivalName: festival.name,
                        discountPercentage: festival.discount,
                        validFrom: startDate,
                        validUntil: endDate,
                        message: festival.msg
                    });
                    generated.push(newCoupon);
                }
            } else {
                // Optional: Deactivate expired festival coupons
                // await Coupon.findOneAndUpdate({ code: festival.code }, { isActive: false });
            }
        }

        if (res) {
            res.json({ message: "Sync complete", newCoupons: generated });
        } else {
            console.log("Coupon Sync Background Job Complete. Generated:", generated.length);
        }

    } catch (error) {
        console.error("Coupon Sync Error:", error);
        if (res) res.status(500).json({ error: error.message });
    }
};

exports.getActiveCoupons = async (req, res) => {
    try {
        const today = new Date();
        // Find coupons that are Active AND Today is before ValidUntil
        const coupons = await Coupon.find({
            isActive: true,
            validUntil: { $gte: today }
        });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ message: "Invalid Coupon Code" });
        }

        const today = new Date();
        if (!coupon.isActive || today > coupon.validUntil) {
            return res.status(400).json({ message: "Coupon has expired" });
        }

        if (today < coupon.validFrom) {
            return res.status(400).json({ message: "Coupon is not active yet" });
        }

        res.json({
            valid: true,
            discountPercentage: coupon.discountPercentage,
            code: coupon.code,
            message: `Success! ${coupon.discountPercentage}% discount applied.`
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
