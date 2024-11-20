import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wplynhlsjjzczsgembup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHluaGxzamp6Y3pzZ2VtYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUwNzM5MSwiZXhwIjoyMDQ1MDgzMzkxfQ.UOg9HpjHXLIP7s__uKsNI6XJ0_seUQBGK7UhD8nzgZk';
const supabase = createClient(supabaseUrl, supabaseKey);

const addBill = async (customerId, createdBy, billDocument, total_amount) => {
    const { error } = await supabase
        .from('billing')
        .insert([{ customer_id: customerId, created_by: createdBy, bill_document: billDocument, total_amount:total_amount }]);

    if (error) {
        console.error('Error inserting user:', error);
        return null;
    }

    return { billDocument }; // Return user details (not the password)
};


export default addBill;