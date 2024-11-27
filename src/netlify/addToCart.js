import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wplynhlsjjzczsgembup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHluaGxzamp6Y3pzZ2VtYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUwNzM5MSwiZXhwIjoyMDQ1MDgzMzkxfQ.UOg9HpjHXLIP7s__uKsNI6XJ0_seUQBGK7UhD8nzgZk';
const supabase = createClient(supabaseUrl, supabaseKey);
const addToCart = async (user_id , product_id, quantity) => {
    // Insert user into 'users' table
    const { data, error } = await supabase
        .from('cart_items')
        .insert([{ user_id
            , product_id: product_id, quantity: quantity}])
        .select('cart_item_id'); 

    if (error) {
        console.error('Error inserting user:', error);
        return null;
    }

    // Return the user's id and email
    return data[0].cart_item_id;
};


export default addToCart;