import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ShoppingCart, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../stores/cartStore';
import { Product } from '../types';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore(state => state.addToCart);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        toast.error('Error fetching product');
        return;
      }
      
      setProduct(data);
    }
    
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart(product, quantity);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Error adding to cart');
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2874f0]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-4 rounded-lg">
        <img
          src={product.image_url || 'https://via.placeholder.com/500'}
          alt={product.name}
          className="w-full h-96 object-contain"
        />
      </div>
      
      <div className="bg-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <div className="flex items-center mb-4">
          <div className="flex items-center bg-green-500 text-white px-2 py-1 rounded">
            <span className="mr-1">4.5</span>
            <Star className="h-4 w-4" />
          </div>
          <span className="ml-2 text-gray-500">(2,345 ratings)</span>
        </div>
        
        <div className="mb-6">
          <span className="text-3xl font-bold">₹{product.price}</span>
          <span className="ml-2 text-green-600">72% off</span>
        </div>
        
        <p className="text-gray-600 mb-6">{product.description}</p>
        
        <div className="flex items-center mb-6">
          <label className="mr-4">Quantity:</label>
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border rounded-md px-2 py-1"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        
        <button
          onClick={handleAddToCart}
          className="w-full bg-[#ff9f00] text-white py-3 px-6 rounded-md flex items-center justify-center hover:bg-[#ff9000]"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}