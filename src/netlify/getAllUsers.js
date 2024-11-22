import { createClient } from '@supabase/supabase-js';
// import GenerateToken from './jwt';

const supabaseUrl = 'https://wplynhlsjjzczsgembup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHluaGxzamp6Y3pzZ2VtYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUwNzM5MSwiZXhwIjoyMDQ1MDgzMzkxfQ.UOg9HpjHXLIP7s__uKsNI6XJ0_seUQBGK7UhD8nzgZk';

const supabase = createClient(supabaseUrl, supabaseKey);

const getAllUsers = async () => {
    const { data: users, error } = await supabase
    .from('users')
    .select('id, email, full_name, created_at, mobile_no, address, role_id, isactive, user_roles(id, role)');  // Join billing with users table

    if (error) {
        console.error('Error fetching bills:', error.message);
        return [];
    }
    return { users};
};

// Exporting getAllProducts as default
export default getAllUsers;
