import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => Promise<void>;
  onRemove: (productId: string) => Promise<void>;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="p-4 border-b last:border-b-0">
      <div className="flex items-center">
        <img
          src={item.product?.image_url || 'https://via.placeholder.com/100'}
          alt={item.product?.name}
          className="w-24 h-24 object-cover rounded"
        />
        <div className="ml-4 flex-1">
          <h3 className="font-semibold">{item.product?.name}</h3>
          <p className="text-gray-600">₹{item.product?.price}</p>
          
          <div className="flex items-center mt-2">
            <button
              onClick={() => onUpdateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="mx-3">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={() => onRemove(item.product_id)}
              className="ml-auto p-1 text-red-500 hover:bg-red-50 rounded-full"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}