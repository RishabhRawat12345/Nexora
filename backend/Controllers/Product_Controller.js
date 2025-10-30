const Product = require("../Models/Product_Schema");
const Cart = require("../Models/Cart_Schema");

const Receipt = require("../Models/Receipt_Schema");
const getAllProducts = async (req, res) => {
  try {
    const data = await Product.find();
    res.status(200).json({ message: "Products fetched successfully", data });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    if (!productId || !qty) {
      return res.status(400).json({ message: "productId and qty are required" });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const newItem = new Cart({
      productId,
      qty,
      name: product.name,
      price: product.price,
      image: product.image,
      total: product.price * qty,
    });

    await newItem.save();

    res.status(201).json({
      message: "Item added to cart successfully",
      data: {
        _id: newItem._id,
        productId: newItem.productId,
        name: newItem.name,
        price: newItem.price,
        image: newItem.image,
        qty: newItem.qty,
        total: newItem.total,
      },
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Cart.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    res.status(200).json({ message: "Item removed from cart", data: deletedItem });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const getCart = async (req, res) => {
  try {
    const cartItems = await Cart.find();
    const total = cartItems.reduce((sum, item) => sum + item.total, 0);

    res.status(200).json({
      message: "Cart fetched successfully",
      cartItems,
      total,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




const checkout = async (req, res) => {
  try {
    const { name, email } = req.body; // 🧾 Get buyer info from frontend

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Fetch items from the cart
    const cartItems = await Cart.find();

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const tax = subtotal * 0.18; // Example: 18% tax
    const total = subtotal + tax;

    // Prepare receipt data
    const receiptData = {
      name,
      email,
      items: cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        price: item.price,
        total: item.price * item.qty,
      })),
      subtotal,
      tax,
      total,
      itemCount: cartItems.length,
    };
    const savedReceipt = await Receipt.create(receiptData);
    await Cart.deleteMany();

    res.status(200).json({
      message: "Checkout successful and receipt saved.",
      receipt: savedReceipt,
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




module.exports = {
  getAllProducts,
  addToCart,
  deleteCartItem,
  getCart,
  checkout,
};
