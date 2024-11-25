import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wplynhlsjjzczsgembup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHluaGxzamp6Y3pzZ2VtYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUwNzM5MSwiZXhwIjoyMDQ1MDgzMzkxfQ.UOg9HpjHXLIP7s__uKsNI6XJ0_seUQBGK7UhD8nzgZk';
const supabase = createClient(supabaseUrl, supabaseKey);
const registerUser = async (email, password, fullName, mobileNo, address, role_id) => {
    // Insert user into 'users' table
    const { data, error } = await supabase
        .from('users')
        .insert([{ email, password: password, full_name: fullName, mobile_no: mobileNo, address: address, role_id: role_id }])
        .select('id, email'); 

    if (error) {
        console.error('Error inserting user:', error);
        return null;
    }

    // Return the user's id and email
    return { id: data[0].id, email: data[0].email };
};


export default registerUser;