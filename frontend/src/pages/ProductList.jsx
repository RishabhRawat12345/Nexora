import React, { useEffect, useState } from "react";
import { getProducts, addToCart } from "../../api";
import toast from "react-hot-toast";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    getProducts().then((res) => setProducts(res.data));
  }, []);

  const handleQuantityChange = (id, change) => {
    setQuantities((prev) => {
      const newQty = Math.max((prev[id] || 1) + change, 1);
      return { ...prev, [id]: newQty };
    });
  };

  const handleAdd = async (id) => {
    const qty = quantities[id] || 1;
    const toastId = toast.loading("Adding to cart...");
    try {
      await addToCart(id, qty);
      toast.dismiss(toastId);
      toast.success(`🛒 Added ${qty} item${qty > 1 ? "s" : ""} to cart!`);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to add product!");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800 tracking-tight">
        Our Premium Collection
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {products?.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
          >
            <div className="relative">
              <img
                src={p.image}
                alt={p.name}
                className="h-64 w-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow">
                ₹{p.price}
              </div>
            </div>
            <div className="p-5 flex flex-col justify-between h-[220px]">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {p.name}
                </h2>
                <p className="text-gray-500 text-sm mt-1 mb-4 line-clamp-2">
                  {p.description || "High-quality product designed with care."}
                </p>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center border rounded-lg px-2 py-1 bg-gray-50">
                  <button
                    onClick={() => handleQuantityChange(p._id, -1)}
                    className="px-2 text-gray-600 hover:text-blue-600 text-xl font-medium"
                  >
                    −
                  </button>
                  <input
                    type="text"
                    value={quantities[p._id] || 1}
                    readOnly
                    className="w-8 text-center border-none bg-transparent font-medium text-gray-800 outline-none"
                  />
                  <button
                    onClick={() => handleQuantityChange(p._id, 1)}
                    className="px-2 text-gray-600 hover:text-blue-600 text-xl font-medium"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleAdd(p._id)}
                  className="ml-3 flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-sm transition-all"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
