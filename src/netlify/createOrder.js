import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wplynhlsjjzczsgembup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHluaGxzamp6Y3pzZ2VtYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUwNzM5MSwiZXhwIjoyMDQ1MDgzMzkxfQ.UOg9HpjHXLIP7s__uKsNI6XJ0_seUQBGK7UhD8nzgZk';
const supabase = createClient(supabaseUrl, supabaseKey);

const generateUniqueOrderNumber = () => {
    const timestamp = Date.now().toString(); // Current timestamp
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase(); // Random alphanumeric string
    return `ORD-${timestamp}-${randomString}`; // Combine to form unique order number
};

const createOrder = async (customerId, cgst, sgst, GrandTotal, AddressId, transactionId, isBuyNow, productId, file_id) => {
    const uniqueOrderNumber = generateUniqueOrderNumber();
    const { data, error } = await supabase.rpc('place_order_new', {
        customer_id: Number(customerId),
        address_id: Number(AddressId),
        total_amount: GrandTotal,
        cgst,
        sgst,
        transaction_id: transactionId,
        order_number: uniqueOrderNumber,
        buynow: isBuyNow,
        product_id_ref : Number(productId),
        file_id_ref: file_id
    });

    if (error) {
        console.error('Error creating order transaction:', error);
        return null;
    }
    return { uniqueOrderNumber };
};

export default createOrder;