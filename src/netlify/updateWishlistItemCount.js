
import { createClient } from '@supabase/supabase-js';
// import GenerateToken from './jwt';

const supabaseUrl = 'https://wplynhlsjjzczsgembup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHluaGxzamp6Y3pzZ2VtYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUwNzM5MSwiZXhwIjoyMDQ1MDgzMzkxfQ.UOg9HpjHXLIP7s__uKsNI6XJ0_seUQBGK7UhD8nzgZk';

const supabase = createClient(supabaseUrl, supabaseKey);


// Update inventory for a specific item
export const updateWishlistItemCount = async (Id, quantity) => {
    const { data, error } = await supabase
      .from('wishlist')
      .update({ quantity })
      .eq('wishlist_id', Id); // Replace with the actual field name
  
    if (error) {
      console.error('Error updating wishlist:', error.message);
      return null;
    }
  
    return data;
  };