const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  items: [
    {
      name: String,
      qty: Number,
      price: Number,
      total: Number,
    },
  ],
  subtotal: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  itemCount: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    default: "✅ Checkout successful! Thank you for your purchase.",
  },
});

module.exports = mongoose.model("Receipt", receiptSchema);
