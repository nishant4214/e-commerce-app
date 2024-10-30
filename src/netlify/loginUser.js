import { createClient } from '@supabase/supabase-js';
// import GenerateToken from './jwt';

const supabaseUrl = 'https://wplynhlsjjzczsgembup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHluaGxzamp6Y3pzZ2VtYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUwNzM5MSwiZXhwIjoyMDQ1MDgzMzkxfQ.UOg9HpjHXLIP7s__uKsNI6XJ0_seUQBGK7UhD8nzgZk';
const supabase = createClient(supabaseUrl, supabaseKey);
const loginUser = async (email, password) => {
    // Fetch the user from the database
    const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email);

    if (error || users.length === 0) {
        return null;
    }

    const user = users[0];

    // Compare the hashed password with the provided password
    const isMatch = password === user.password ? true : false;
    
    if (!isMatch) {
        return null;
    }
    // // Generate JWT token
    // const Token = GenerateToken(user.email)

    
    return { user}; // Return user details (not the password)
};


export default loginUser;