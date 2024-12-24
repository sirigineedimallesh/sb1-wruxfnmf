import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

function Navbar() {
  const user = useAuthStore(state => state.user);

  return (
    <nav className="bg-[#2874f0] text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold">Flipkart</Link>
          
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products, brands and more"
                className="w-full py-2 px-4 pr-10 rounded-sm text-gray-900 focus:outline-none"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center hover:text-gray-200">
                  <User className="h-5 w-5 mr-1" />
                  <span>{user.full_name}</span>
                </Link>
                <Link to="/cart" className="flex items-center hover:text-gray-200">
                  <ShoppingCart className="h-5 w-5 mr-1" />
                  <span>Cart</span>
                </Link>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-white text-[#2874f0] px-8 py-1 font-medium hover:bg-gray-100"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}