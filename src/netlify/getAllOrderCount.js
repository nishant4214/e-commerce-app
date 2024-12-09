

import { createClient } from '@supabase/supabase-js';
// import GenerateToken from './jwt';

const supabaseUrl = 'https://wplynhlsjjzczsgembup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHluaGxzamp6Y3pzZ2VtYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUwNzM5MSwiZXhwIjoyMDQ1MDgzMzkxfQ.UOg9HpjHXLIP7s__uKsNI6XJ0_seUQBGK7UhD8nzgZk';

const supabase = createClient(supabaseUrl, supabaseKey);

const getAllOrderCount = async () => {
    const { data, error } = await supabase
    .from('orders')
    .select('order_id', { count: 'exact' })
    .filter('order_date', 'gte', new Date().toISOString().slice(0, 10)) // Assuming 'date' column stores the date
    .filter('order_date', 'lt', new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10)); // Ensures "today" and excludes "tomorrow"
  // Calculate the sum of `total_amount` for today's date
  
  if (error) {
    console.error('Error fetching order count:', error.message);
    return 0;
}
return data.length;  // Return the count of products
};

export default getAllOrderCount;
  