import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wplynhlsjjzczsgembup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHluaGxzamp6Y3pzZ2VtYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUwNzM5MSwiZXhwIjoyMDQ1MDgzMzkxfQ.UOg9HpjHXLIP7s__uKsNI6XJ0_seUQBGK7UhD8nzgZk';

const supabase = createClient(supabaseUrl, supabaseKey);
const getAllWishListItemsByUserId = async (userId) => {
  try 
  {
    const { data: wishlist_items, error } = await supabase
    .from('wishlist')
    .select('*, products(id, name, price, image_url, description, categories(*))')
    .eq('user_id', userId)
    .eq('isactive', true);

    if (error) {
      console.error('Error fetching cart:', error.message);
      return { wishlist_items: [] }; 
    }

    const updatedWishlistItems = wishlist_items.map(item => ({
      ...item,
      id: item.product_id,
    }));

    return { updatedWishlistItems };
  }catch(error) 
  {
    console.error("Error in fetching wishlist:", error);
    return { wishlist_items: [] };
  }
};
   

export default getAllWishListItemsByUserId;
