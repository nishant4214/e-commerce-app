import { createClient } from '@supabase/supabase-js';
// import GenerateToken from './jwt';

const supabaseUrl = 'https://wplynhlsjjzczsgembup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHluaGxzamp6Y3pzZ2VtYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUwNzM5MSwiZXhwIjoyMDQ1MDgzMzkxfQ.UOg9HpjHXLIP7s__uKsNI6XJ0_seUQBGK7UhD8nzgZk';

const supabase = createClient(supabaseUrl, supabaseKey);

const getAllBills = async () => {
    const { data: bills, error } = await supabase
    .from('billing')
    .select('id, customer_id, bill_document, created_at, users(id, full_name, email)');  // Join billing with users table



    if (error) {
        console.error('Error fetching bills:', error.message);
        return [];
    }
    return { bills};
};

// Exporting getAllProducts as default
export default getAllBills;
