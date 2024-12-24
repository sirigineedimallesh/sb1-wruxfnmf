import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';

function Cart() {
  const { items, loading, fetchCart, updateQuantity, removeFromCart } = useCartStore();
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchCart();
  }, [fetchCart, user, navigate]);

  const handleCheckout = async () => {
    try {
      const total = items.reduce((sum, item) => {
        return sum + (item.product?.price || 0) * item.quantity;
      }, 0);

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{ total_amount: total }])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product?.price || 0
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      await Promise.all(items.map(item => 
        removeFromCart(item.product_id)
      ));

      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error('Error placing order');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2874f0]"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link
          to="/"
          className="text-[#2874f0] hover:underline"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const total = items.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-md">
          {items.map((item) => (
            <div key={item.id} className="p-4 border-b last:border-b-0">
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
                      onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="mx-3">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="ml-auto p-1 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
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
          onClick={handleCheckout}
          className="w-full bg-[#fb641b] text-white py-3 rounded-md hover:bg-[#fa580c]"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}