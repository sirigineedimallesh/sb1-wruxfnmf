import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Order } from '../types';

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    async function fetchOrders() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            items:order_items (
              *,
              product:products (*)
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        toast.error('Error fetching orders');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2874f0]"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
        <button
          onClick={() => navigate('/')}
          className="text-[#2874f0] hover:underline"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">
                    Order placed: {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Order ID: {order.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Total: ₹{order.total_amount}</p>
                  <p className="text-sm text-gray-600">
                    Status: <span className="capitalize">{order.status}</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center py-4 border-b last:border-b-0">
                  <img
                    src={item.product?.image_url || 'https://via.placeholder.com/100'}
                    alt={item.product?.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="ml-4">
                    <h3 className="font-semibold">{item.product?.name}</h3>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-gray-600">Price: ₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}