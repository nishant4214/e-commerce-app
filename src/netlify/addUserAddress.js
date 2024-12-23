import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wplynhlsjjzczsgembup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHluaGxzamp6Y3pzZ2VtYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUwNzM5MSwiZXhwIjoyMDQ1MDgzMzkxfQ.UOg9HpjHXLIP7s__uKsNI6XJ0_seUQBGK7UhD8nzgZk';
const supabase = createClient(supabaseUrl, supabaseKey);

const addUserAddress = async (userId, streetAddress, cityId, stateId, postalCode, contactNumber) => {
    const { address_id, error } = await supabase
        .from('delivery_addresses')
        .insert([{ user_id: userId, street_address: streetAddress, city_id: cityId, state_id:stateId,postal_code:postalCode,phone_number:contactNumber }])
        .select('address_id'); 
    if (error) {
        console.error('Error inserting user:', error);
        return null;
    }

    return { address_id }; // Return user details (not the password)
};


export default addUserAddress;