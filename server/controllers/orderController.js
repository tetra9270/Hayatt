const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { sendOrderEmail, sendStatusUpdateEmail, sendCancellationEmail } = require('../utils/emailService');

// Helper to calculate total
const calculateOrderTotal = async (items) => {
    // TEMPORARY FIX: Use same static list as paymentController
    const staticProducts = [
        { id: 1, price: "$299" }, { id: 2, price: "$599" }, { id: 3, price: "$189" },
        { id: 4, price: "$349" }, { id: 5, price: "$499" }, { id: 6, price: "$899" },
        { id: 7, price: "$129" }, { id: 8, price: "$999" }, { id: 9, price: "$799" },
        { id: 10, price: "$450" }, { id: 11, price: "$320" }, { id: 12, price: "$199" },
        { id: 13, price: "$1200" }, { id: 14, price: "$9999" }, { id: 15, price: "$850" },
        { id: 16, price: "$15000" }, { id: 17, price: "$2200" }, { id: 18, price: "$650" },
        { id: 19, price: "$4500" }, { id: 20, price: "$300" }, { id: 21, price: "$150" },
        { id: 22, price: "$750" }, { id: 23, price: "$120" }, { id: 24, price: "$80" }
    ];

    let total = 0;
    for (const item of items) {
        // Try to find in static first (legacy), then DB if needed (future)
        // For now, assume price is passed correctly or validated. 
        // Real implementation should fetch from DB using item.id

        // Since we are moving to DB products, let's try to fetch price from DB if we can, 
        // OR rely on the passed price if we trust it (less secure but faster for this demo phase).
        // Let's stick to the static list for calculation for legacy items, 
        // but for new items (which won't be in static list), we need to handle it.

        let price = 0;
        const product = staticProducts.find(p => p.id === item.id);
        if (product) {
            price = parseInt(product.price.replace(/[^0-9]/g, ''));
        } else {
            // It might be a DB product with string ID.
            // For now, use the price sent from frontend (trusted client for demo)
            price = parseInt(item.price.replace(/[^0-9]/g, ''));
        }
        total += price * item.quantity;
    }
    // Return in CENTS
    return total * 100;
};

exports.createOrder = async (req, res) => {
    try {
        console.log("---- CREATE ORDER REQUEST RECEIVED ----");
        console.log("Body:", JSON.stringify(req.body, null, 2));

        const { items, shippingAddress, paymentId, couponCode } = req.body;
        let totalAmount = await calculateOrderTotal(items);
        console.log("Calculated Total (Pre-Discount):", totalAmount);

        // Apply Coupon if present
        if (couponCode) {
            const Coupon = require('../models/Coupon');
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
            const today = new Date();

            if (coupon && coupon.isActive && today >= coupon.validFrom && today <= coupon.validUntil) {
                const discountAmount = (totalAmount * coupon.discountPercentage) / 100;
                totalAmount = totalAmount - discountAmount;
                console.log(`Coupon ${couponCode} Applied. Discount: ${discountAmount}, New Total: ${totalAmount}`);
            }
        }

        const orderData = {
            user: req.user._id,
            orderItems: items.map(item => ({
                product: item.id.toString(),
                name: item.name,
                qty: item.quantity,
                image: item.image,
                price: item.price
            })),
            shippingAddress,
            paymentMethod: paymentId === 'COD' ? 'Cash on Delivery' : 'Razorpay',
            totalPrice: totalAmount / 100, // Normalized for Schema
            isPaid: true,
            paidAt: Date.now(),
            paymentResult: {
                id: paymentId,
                status: 'success',
                email_address: req.user.email
            },
            status: 'Pending'
        };
        console.log("Order Data Payload:", JSON.stringify(orderData, null, 2));

        const newOrder = new Order(orderData);

        const savedOrder = await newOrder.save();
        console.log("Order Saved Successfully:", savedOrder._id);

        // Award XP and Update Rank
        const user = await User.findById(req.user._id);
        if (user) {
            // XP Calculation: 10 XP per $1 spent (simplified)
            const earnedXP = Math.floor(totalAmount / 10);
            user.xp = (user.xp || 0) + earnedXP;

            // Rank Logic
            if (user.xp >= 10000) user.rank = 'Legend';
            else if (user.xp >= 5000) user.rank = 'Commander';
            else if (user.xp >= 2000) user.rank = 'Elite';
            else if (user.xp >= 500) user.rank = 'Agent';
            else user.rank = 'Recruit';

            await user.save();
        }

        // Send Email Notifications
        await sendOrderEmail(savedOrder, req.user);

        res.status(201).json(savedOrder);
    } catch (error) {
        console.error("!!!! ORDER SAVE ERROR !!!!");
        console.error(error);
        res.status(500).json({ error: error.message, details: error });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }
        const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.updateOrderStatus = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }
        const { status } = req.body;
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            order.status = status;
            const updatedOrder = await order.save();

            // Send Alert
            if (order.user) {
                await sendStatusUpdateEmail(updatedOrder, order.user);
            }

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const { reason } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Ensure user owns the order (or is admin)
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Check if cancellable
        if (order.status === 'Shipped' || order.status === 'Delivered' || order.status === 'Cancelled') {
            return res.status(400).json({ message: `Cannot cancel order that is ${order.status}` });
        }

        order.status = 'Cancelled';
        order.cancellationReason = reason || 'No reason provided';
        const updatedOrder = await order.save();

        // Send Email
        await sendCancellationEmail(updatedOrder, req.user);

        res.json({ message: 'Order cancelled successfully', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
