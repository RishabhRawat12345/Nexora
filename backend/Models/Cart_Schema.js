// Models/Cart_Schema.js
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Cart", cartSchema);
