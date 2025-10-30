import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import ProductList from "./pages/ProductList";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Navbar from "./pages/Navbar";

const App = () => {
  const [receipt, setReceipt] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout receipt={receipt} setReceipt={setReceipt} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
