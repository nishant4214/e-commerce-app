import { createClient } from '@supabase/supabase-js';
// import GenerateToken from './jwt';

const supabaseUrl = 'https://wplynhlsjjzczsgembup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHluaGxzamp6Y3pzZ2VtYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUwNzM5MSwiZXhwIjoyMDQ1MDgzMzkxfQ.UOg9HpjHXLIP7s__uKsNI6XJ0_seUQBGK7UhD8nzgZk';

const supabase = createClient(supabaseUrl, supabaseKey);

const getAllCategories = async () => {
    const { data:categories, error } = await supabase.from('categories').select('*');
    
    if (error) {
        console.error('Error fetching categories:', error.message);
        return [];
    }
    return {categories};
};

export default getAllCategories;
