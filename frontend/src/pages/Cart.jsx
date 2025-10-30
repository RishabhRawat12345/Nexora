import React, { useEffect, useState } from "react";
import { getCart, deleteCartItem } from "../../api";
import Checkout from "../pages/Checkout";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const navigate = useNavigate();

  const loadCart = async () => {
    try {
      const res = await getCart();
      const items = res?.cartItems || res || [];
      setCart(items);
    } catch (error) {
      console.error("Error loading cart:", error);
      toast.error("Failed to load cart.");
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteCartItem(id);
      toast.success("Item removed from cart!");
      loadCart();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item!");
    }
  };

  const handleCheckoutClick = () => {
    setLoadingCheckout(true);
    setShowCheckout(true);
    setTimeout(() => setLoadingCheckout(false), 500);
  };

  // ✅ Calculate subtotal and total quantity (no GST)
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );
  const totalQuantity = cart.reduce(
    (sum, item) => sum + (item.qty || 1),
    0
  );

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md mt-8 border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-1 rounded-md font-medium transition"
        >
          ← Back to Shop
        </button>
        <h2 className="text-3xl font-bold text-center flex-1 text-purple-700">
          🛒 Your Cart
        </h2>
      </div>

      {cart.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">
          No items in your cart.
        </p>
      ) : (
        <>
          {/* Cart items */}
          <div className="space-y-4 mb-8">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">
                      {item.name}
                    </p>
                    <p className="text-gray-500 text-sm">
                      ₹{item.price} × {item.qty}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <p className="font-bold text-gray-800 text-lg">
                    ₹{(item.price * item.qty).toFixed(2)}
                  </p>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                    onClick={() => handleDelete(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Billing summary */}
          <div className="border-t pt-6 space-y-3 mb-6 text-gray-700">
            <div className="flex justify-between">
              <span>Total Quantity</span>
              <span>{totalQuantity}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Total Amount</span>
              <span className="text-green-600">₹{subtotal.toFixed(2)}</span>
            </div>
          </div>

          {!showCheckout ? (
            <div className="text-center">
              <button
                onClick={handleCheckoutClick}
                disabled={loadingCheckout}
                className={`${
                  loadingCheckout
                    ? "bg-purple-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                } text-white px-6 py-2 rounded-md font-semibold transition`}
              >
                {loadingCheckout ? "Processing..." : "Proceed to Checkout"}
              </button>
            </div>
          ) : (
            <Checkout
              cart={cart}
              subtotal={subtotal}
              totalQuantity={totalQuantity}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
