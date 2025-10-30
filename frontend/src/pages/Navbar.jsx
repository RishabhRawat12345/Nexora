import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User, Home, Package } from "lucide-react";
import { Button } from "../components/ui/button";

const Navbar = () => {


  return (
    <nav className="w-full bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition">
          Vibe<span className="text-blue-500">Shop</span>
        </Link>
        <div className="flex items-center space-x-3">
          <Link to="/cart">
            <Button variant="outline" size="sm" className="flex items-center">
              <ShoppingCart className="w-4 h-4 mr-2" /> Cart
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
