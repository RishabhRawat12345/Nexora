import React, { useState, useEffect } from "react";
import { getCart, checkout } from "../../api"; 
import toast from "react-hot-toast";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [buyer, setBuyer] = useState({ name: "", email: "" });
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getCart()
      .then((res) => setCartItems(res.cartItems || []))
      .catch(() => toast.error("Failed to load cart items"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBuyer((prev) => ({ ...prev, [name]: value }));
  };
  const handleCheckout = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!buyer.name || !buyer.email) {
      toast.error("Please enter your name and email!");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setLoading(true);
    try {
      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
      const tax = subtotal * 0.18;
      const total = subtotal + tax;

      const receiptData = {
        name: buyer.name,
        email: buyer.email,
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
        timestamp: new Date().toISOString(),
      };
      const response = await checkout(receiptData);

      if (response && response.receipt) {
        setReceipt(response.receipt);
        toast.success(response.message || "Checkout successful!");
        console.log("Checkout successful:", response.receipt);
      } else {
        throw new Error(response.message || "Checkout failed");
      }
    } catch (err) {
      console.error("Checkout failed:", err);
      toast.error("Something went wrong during checkout!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mt-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">
        Checkout
      </h2>

      {!receipt ? (
        <form onSubmit={handleCheckout} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={buyer.name}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={buyer.email}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Enter your email address"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded text-white font-semibold transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {loading ? "Processing..." : "Confirm Checkout"}
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 border rounded bg-gray-50 shadow-sm">
          <h3 className="font-semibold mb-2 text-green-700 text-lg">🧾 Receipt</h3>

          <p><strong>Name:</strong> {receipt.name}</p>
          <p><strong>Email:</strong> {receipt.email}</p>
          <p><strong>Date:</strong> {new Date(receipt.timestamp).toLocaleString()}</p>

          <h4 className="mt-4 font-semibold text-gray-800 border-b pb-1">Items</h4>
          <ul className="divide-y divide-gray-200 mt-2">
            {receipt.items.map((item, idx) => (
              <li key={idx} className="py-2 flex justify-between text-sm">
                <span>{item.name} × {item.qty}</span>
                <span className="font-medium">₹{item.total}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 text-sm space-y-1">
            <p className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{receipt.subtotal.toFixed(2)}</span>
            </p>
            <p className="flex justify-between">
              <span>Tax (18%):</span>
              <span>₹{receipt.tax.toFixed(2)}</span>
            </p>
            <hr />
            <p className="flex justify-between text-lg font-semibold text-green-700 mt-2">
              <span>Total:</span>
              <span>₹{receipt.total.toFixed(2)}</span>
            </p>
            <p><strong>Total Items:</strong> {receipt.itemCount}</p>
          </div>

          <button
            className="mt-5 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full"
            onClick={() => setReceipt(null)}
          >
            Close Receipt
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
