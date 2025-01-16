import { createClient } from '@supabase/supabase-js';
// import GenerateToken from './jwt';

const supabaseUrl = 'https://wplynhlsjjzczsgembup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHluaGxzamp6Y3pzZ2VtYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUwNzM5MSwiZXhwIjoyMDQ1MDgzMzkxfQ.UOg9HpjHXLIP7s__uKsNI6XJ0_seUQBGK7UhD8nzgZk';

const supabase = createClient(supabaseUrl, supabaseKey);


// Fetch inventory count from the 'inventory' table
const getInventoryCount = async () => {
    // Fetch the inventory data with the exact count of rows
    const { data, error, count } = await supabase
      .from('inventory')
      .select('quantity', { count: 'exact' });
  
    // If there's an error in fetching data, log the error and return 0
    if (error) {
      console.error('Error fetching inventory count:', error.message);
      return 0;
    }
    const totalQuantity = data.reduce((acc, row) => acc + row.quantity, 0);
    return  totalQuantity;
    
  };
  
export default getInventoryCount;
