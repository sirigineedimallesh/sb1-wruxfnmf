import { create } from 'zustand';
import { CartItem, Product } from '../types';
import { supabase } from '../lib/supabase';

interface CartState {
  items: CartItem[];
  loading: boolean;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  fetchCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,
  addToCart: async (product: Product, quantity: number) => {
    set({ loading: true });
    
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('product_id', product.id)
      .single();

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id);
      
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('cart_items')
        .insert([{ product_id: product.id, quantity }]);
      
      if (error) throw error;
    }

    await get().fetchCart();
    set({ loading: false });
  },
  removeFromCart: async (productId: string) => {
    set({ loading: true });
    
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('product_id', productId);
    
    if (error) throw error;
    
    await get().fetchCart();
    set({ loading: false });
  },
  updateQuantity: async (productId: string, quantity: number) => {
    set({ loading: true });
    
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('product_id', productId);
    
    if (error) throw error;
    
    await get().fetchCart();
    set({ loading: false });
  },
  fetchCart: async () => {
    set({ loading: true });
    
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `);
    
    if (error) throw error;
    
    set({ items: data || [], loading: false });
  },
}));