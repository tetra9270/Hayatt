const Product = require('../models/Product');

// Razorpay Setup
const Razorpay = require('razorpay');
const calculateOrderAmount = async (items) => {
    let total = 0;
    for (const item of items) {
        // Find product in DB to get real price
        const product = await Product.findOne({ id: item.id });
        if (product) {
            const price = parseInt(product.price.replace(/[^0-9]/g, ''));
            total += price * item.quantity;
        }
    }
    return total * 100; // Convert to cents/paise
};

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createRazorpayOrder = async (req, res) => {
    try {
        const { items } = req.body;
        console.log("Received items for payment:", items);

        const calculateOrderAmount = async (items) => {
            let total = 0;

            // TEMPORARY FIX: Start with a hardcoded list of products from products.ts 
            // This is because the MongoDB might not be seeded with the exact IDs/Prices matching the frontend static file.
            // In a production app, you would ALWAYS fetch from DB. 
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

            for (const item of items) {
                console.log(`Processing item: ${item.id}`);
                // Try finding in DB first (if using real DB IDs)
                // const product = await Product.findById(item.id); 

                // Fallback to static lookup map for this phase
                const product = staticProducts.find(p => p.id === item.id);

                if (product) {
                    const price = parseInt(product.price.replace(/[^0-9]/g, ''));
                    total += price * item.quantity;
                    console.log(`Matched Product ID ${item.id} Price: ${price} Total so far: ${total}`);
                } else {
                    console.log(`Product NOT FOUND for ID: ${item.id}`);
                }
            }
            return total * 100; // Convert to cents/paise
        };

        const amount = await calculateOrderAmount(items);

        if (amount === 0) {
            console.error("Calculated amount is 0");
            return res.status(400).json({ error: 'Invalid amount: Total is 0' });
        }

        const options = {
            amount: amount,
            currency: "USD",
            receipt: `receipt_order_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error('Razorpay Error:', error);
        res.status(500).json({ error: error.message });
    }
};
