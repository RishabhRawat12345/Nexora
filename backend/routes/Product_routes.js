const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  addToCart,
  deleteCartItem,
  getCart,
  checkout,
} = require("../Controllers/Product_Controller");

router.get("/products", getAllProducts);
router.post("/cart", addToCart);
router.delete("/cart/:id", deleteCartItem);
router.get("/cart", getCart);
router.post("/checkout", checkout);

module.exports = router;
