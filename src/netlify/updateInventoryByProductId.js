
import { createClient } from '@supabase/supabase-js';
// import GenerateToken from './jwt';

const supabaseUrl = 'https://wplynhlsjjzczsgembup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHluaGxzamp6Y3pzZ2VtYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUwNzM5MSwiZXhwIjoyMDQ1MDgzMzkxfQ.UOg9HpjHXLIP7s__uKsNI6XJ0_seUQBGK7UhD8nzgZk';

const supabase = createClient(supabaseUrl, supabaseKey);


// Update inventory for a specific item
export const updateInventoryByProductId = async (productId, quantity) => {
  // Fetch existing quantity for the product
  const { data: existingQuantity, error: fetchError } = await supabase
    .from('inventory')
    .select('quantity')
    .eq('product_id', productId)
    .single();  // Use .single() to return a single row

  if (fetchError) {
    console.error('Error fetching inventory:', fetchError.message);
    return null;
  }

  if (!existingQuantity) {
    console.error('Product not found in inventory');
    return null;
  }

  // Calculate updated quantity
  const updatedQuantity = existingQuantity.quantity - quantity;
  if (updatedQuantity < 0) {
    console.error('Insufficient stock for product', productId);
    return null;
  }

  // Update the inventory with the new quantity
  const { data, error } = await supabase
    .from('inventory')
    .update({ quantity: updatedQuantity })
    .eq('product_id', productId);

  if (error) {
    console.error('Error updating inventory:', error.message);
    return null;
  }

  return data;  // Return updated data
};