import { createClient } from '@supabase/supabase-js';
// import GenerateToken from './jwt';

const supabaseUrl = 'https://wplynhlsjjzczsgembup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHluaGxzamp6Y3pzZ2VtYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUwNzM5MSwiZXhwIjoyMDQ1MDgzMzkxfQ.UOg9HpjHXLIP7s__uKsNI6XJ0_seUQBGK7UhD8nzgZk';

const supabase = createClient(supabaseUrl, supabaseKey);
const getAllCartItemsByUserId = async (userId) => {
    try {
      const { data: cart_items, error } = await supabase
        .from('cart_items')
        .select('*, products(id, name, price, image_url, description)')
        .eq('user_id', userId)
        .eq('isactive', true);
  
      if (error) {
        console.error('Error fetching cart:', error.message);
        return { cart_items: [] }; // Return an empty array if there was an error
      }

      const updatedCartItems = cart_items.map(item => ({
        ...item,
        id: item.product_id,  // Map product_id to id
      }));
    
  
      return { updatedCartItems }; // Return the cart_items object as part of the response
    } catch (error) {
      console.error("Error in fetching cart:", error);
      return { cart_items: [] }; // Return empty array in case of any other errors
    }
  };
   

export default getAllCartItemsByUserId;
