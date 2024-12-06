import { createClient } from '@supabase/supabase-js';
// import GenerateToken from './jwt';

const supabaseUrl = 'https://wplynhlsjjzczsgembup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHluaGxzamp6Y3pzZ2VtYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUwNzM5MSwiZXhwIjoyMDQ1MDgzMzkxfQ.UOg9HpjHXLIP7s__uKsNI6XJ0_seUQBGK7UhD8nzgZk';

const supabase = createClient(supabaseUrl, supabaseKey);


const getAllStatusCodes = async () => {
    try {
      const { data: order_status_codes, error } = await supabase
        .from('order_status_codes')
        .select('*')
  
      if (error) {
        console.error('Error fetching orders:', error.message);
        return { order_status_codes: [] }; 
      }
  
      return { order_status_codes };
    } catch (error) {
      console.error("Error in fetching orders:", error);
      return { order_status_codes: [] };
    }
  };
   

export default getAllStatusCodes;
