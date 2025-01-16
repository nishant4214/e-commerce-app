import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wplynhlsjjzczsgembup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHluaGxzamp6Y3pzZ2VtYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUwNzM5MSwiZXhwIjoyMDQ1MDgzMzkxfQ.UOg9HpjHXLIP7s__uKsNI6XJ0_seUQBGK7UhD8nzgZk';
const supabase = createClient(supabaseUrl, supabaseKey);
const addToWishlist = async (user_id , product_id) => {
    // Insert user into 'users' table
    const { data, error } = await supabase
        .from('wishlist')
        .insert([{ user_id
            , product_id: product_id}])
        .select('wishlist_id'); 

    if (error) {
        console.error('Error inserting wishlist:', error);
        return null;
    }
    return data[0].wishlist_id;
};


export default addToWishlist;