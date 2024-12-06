import { createClient } from '@supabase/supabase-js';
// import GenerateToken from './jwt';

const supabaseUrl = 'https://wplynhlsjjzczsgembup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHluaGxzamp6Y3pzZ2VtYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUwNzM5MSwiZXhwIjoyMDQ1MDgzMzkxfQ.UOg9HpjHXLIP7s__uKsNI6XJ0_seUQBGK7UhD8nzgZk';

const supabase = createClient(supabaseUrl, supabaseKey);


const getOrderDetailsById = async (orderId) => {
    try {
        // const { data: order_data, error } = await supabase
        // .from('orders')
        // .select(`
        //   *,
        //   order_items(*, products(*)),
        //   delivery_addresses(*, cities(city_name), states(state_name)),
        //   order_status_codes(*)
        // `)
        // .eq('order_id', orderId)
        // .single(); // Ensure only one order is returned

        const { data: order_data, error } = await supabase
        .from('orders')
        .select(`
            *,
            order_items(*, products(*)),
            delivery_addresses(*, cities(city_name), states(state_name)),
            order_status_codes(*),
            order_status_history(*, order_status_codes(status_name)) -- Include status history with status names
        `)
        .eq('order_id', orderId)
        .single(); // Ensure only one order is returned
      if (error) {
        console.error('Error fetching order data:', error.message);
        return { order_data: [] }; 
      }
  
      return { order_data };
    } catch (error) {
      console.error("Error in fetching order data:", error);
      return { order_data: [] };
    }
  };
   

export default getOrderDetailsById;
