import { createClient } from '@supabase/supabase-js';
// import GenerateToken from './jwt';

const supabaseUrl = 'https://wplynhlsjjzczsgembup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHluaGxzamp6Y3pzZ2VtYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUwNzM5MSwiZXhwIjoyMDQ1MDgzMzkxfQ.UOg9HpjHXLIP7s__uKsNI6XJ0_seUQBGK7UhD8nzgZk';

const supabase = createClient(supabaseUrl, supabaseKey);


const SaveInventory = async (product_id, description, quantity) => {
    const { data, error } = await supabase
        .from('inventory')
        .insert([{ product_id, description, quantity }]);

    if (error) {
        console.error('Error inserting product:', error.message); // Log the error message
        return null;
    }

    if (!data || data.length === 0) {
        console.error('No data returned after insert');
        return null;
    }

    return data[0]; // Return the inserted product details
};

export default SaveInventory;