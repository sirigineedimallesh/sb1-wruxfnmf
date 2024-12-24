import React from 'react';
import { CartItem } from '../../types';

interface CartSummaryProps {
  items: CartItem[];
  onCheckout: () => Promise<void>;
}

export function CartSummary({ items, onCheckout }: CartSummaryProps) {
  const total = items.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-fit">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{total}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="border-t pt-2 font-bold">
          <div className="flex justify-between">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>
      
      <button
        onClick={onCheckout}
        className="w-full bg-[#fb641b] text-white py-3 rounded-md hover:bg-[#fa580c]"
      >
        Place Order
      </button>
    </div>
  );
}