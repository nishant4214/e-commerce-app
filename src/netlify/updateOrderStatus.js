
import { createClient } from '@supabase/supabase-js';
// import GenerateToken from './jwt';

const supabaseUrl = 'https://wplynhlsjjzczsgembup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHluaGxzamp6Y3pzZ2VtYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUwNzM5MSwiZXhwIjoyMDQ1MDgzMzkxfQ.UOg9HpjHXLIP7s__uKsNI6XJ0_seUQBGK7UhD8nzgZk';

const supabase = createClient(supabaseUrl, supabaseKey);
export const updateOrderStatus = async (orderId, StatusCode, comments) => {
  // Fetch the current status of the order
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('status_code')
    .eq('order_id', orderId)
    .single();

  if (fetchError) {
    console.error('Error fetching order:', fetchError.message);
    return { error: 'Unable to fetch order status' };
  }

  const currentStatus = order.status_code;

  // Define allowed transitions
  const allowedTransitions = {
    1: [2, 9],        // Pending -> Confirmed, Cancelled
    2: [4, 9],        // Confirmed -> Dispatched, Cancelled
    4: [5, 8],        // Dispatched -> Delivered, Returned
    5: [8],            // Delivered -> Returned
    6: [],            // Failed -> No further updates allowed
    7: [],            // Rejected -> No further updates allowed
    8: [],            // Returned -> No further updates allowed
    9: [],            // Cancelled -> No further updates allowed
  };

  // Allow "Cancelled" only if the order has not been dispatched (status < 4)
  if (StatusCode === 9 && currentStatus >= 4) {
    return { error: 'Order cannot be cancelled after it has been dispatched' };
  }

  // Check if the transition is valid
  if (!allowedTransitions[currentStatus]?.includes(StatusCode)) {
    return { error: 'Invalid status transition' };
  }

  // Validate mandatory comments for specific transitions
  const requiresComments = [6, 7, 8, 9]; // Failed, Rejected, Returned, Cancelled
  if (requiresComments.includes(StatusCode) && (!comments || comments.trim() === '')) {
    return { error: 'Comments are required for this status update' };
  }

  // Update the order status
  const { data, error } = await supabase
    .from('orders')
    .update({ status_code: StatusCode, comments })
    .eq('order_id', orderId);

  if (error) {
    console.error('Error updating order status:', error.message);
    return { error: 'Unable to update order status' };
  }

  return data; // Return updated data
};
