const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: String, required: true }, // Storing as "$299" to match frontend for now
    image: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    tag: { type: String, default: '' },
    specs: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    lore: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

// Create text index for search
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
