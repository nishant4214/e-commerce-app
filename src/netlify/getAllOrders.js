import { createClient } from '@supabase/supabase-js';
// import GenerateToken from './jwt';

const supabaseUrl = 'https://wplynhlsjjzczsgembup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHluaGxzamp6Y3pzZ2VtYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUwNzM5MSwiZXhwIjoyMDQ1MDgzMzkxfQ.UOg9HpjHXLIP7s__uKsNI6XJ0_seUQBGK7UhD8nzgZk';

const supabase = createClient(supabaseUrl, supabaseKey);


const getAllOrders = async (userId) => {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*, order_status_codes(*), users(*)')
  
      if (error) {
        console.error('Error fetching orders:', error.message);
        return { orders: [] }; 
      }
  
      return { orders };
    } catch (error) {
      console.error("Error in fetching orders:", error);
      return { orders: [] };
    }
  };
   

export default getAllOrders;
