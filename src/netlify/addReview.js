import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wplynhlsjjzczsgembup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHluaGxzamp6Y3pzZ2VtYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUwNzM5MSwiZXhwIjoyMDQ1MDgzMzkxfQ.UOg9HpjHXLIP7s__uKsNI6XJ0_seUQBGK7UhD8nzgZk';
const supabase = createClient(supabaseUrl, supabaseKey);

const addReview = async (orderId, productId, userId, rating, comment) => {
    const { data, error } = await supabase.rpc('add_review', {
        refuser_id: userId,
        refproduct_id: productId,
        refrating: rating,
        refcomment: comment,
        reforder_id: orderId,
      });
    

    if (error) {
        console.error('Error inserting review:', error);
        return null;
    }

    return data;
};

export default addReview;