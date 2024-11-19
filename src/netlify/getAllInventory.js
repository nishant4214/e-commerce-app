import { Inventory } from '@mui/icons-material';
import { createClient } from '@supabase/supabase-js';
// import GenerateToken from './jwt';

const supabaseUrl = 'https://wplynhlsjjzczsgembup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHluaGxzamp6Y3pzZ2VtYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUwNzM5MSwiZXhwIjoyMDQ1MDgzMzkxfQ.UOg9HpjHXLIP7s__uKsNI6XJ0_seUQBGK7UhD8nzgZk';

const supabase = createClient(supabaseUrl, supabaseKey);

const getAllInventory = async () => {
    const { data: inventory, error } =  await supabase
    .from('inventory')
    .select('*, products(id, name, price)')

    if (error) {
        console.error('Error fetching products:', error.message);
        return [];
    }
    return { inventory};
};

// Exporting getAllProducts as default
export default getAllInventory;
