import { createClient } from '@supabase/supabase-js';
// import GenerateToken from './jwt';

const supabaseUrl = 'https://wplynhlsjjzczsgembup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHluaGxzamp6Y3pzZ2VtYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUwNzM5MSwiZXhwIjoyMDQ1MDgzMzkxfQ.UOg9HpjHXLIP7s__uKsNI6XJ0_seUQBGK7UhD8nzgZk';

const supabase = createClient(supabaseUrl, supabaseKey);


const getProductDetailsById = async (productId) => {
    try {

        const { data: product, error } = await supabase
        .from('products')
        .select(`*, reviews(*)`)
        .eq('id', productId)
        .single(); // Ensure only one order is returned
      if (error) {
        console.error('Error fetching product data:', error.message);
        return { product: [] }; 
      }
  
      return { product };
    } catch (error) {
      console.error("Error in fetching product data:", error);
      return { product: [] };
    }
  };
   

export default getProductDetailsById;
