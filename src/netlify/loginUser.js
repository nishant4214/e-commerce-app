// import { createClient } from '@supabase/supabase-js';
// // import GenerateToken from './jwt';

// const supabaseUrl = 'https://wplynhlsjjzczsgembup.supabase.co';
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHluaGxzamp6Y3pzZ2VtYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUwNzM5MSwiZXhwIjoyMDQ1MDgzMzkxfQ.UOg9HpjHXLIP7s__uKsNI6XJ0_seUQBGK7UhD8nzgZk';
// const supabase = createClient(supabaseUrl, supabaseKey);
// const loginUser = async (email, password) => {
//     // Fetch the user from the database
//     const { data: users, error } = await supabase
//         .from('users')
//         .select('*')
//         .eq('email', email);

//     if (error || users.length === 0) {
//         return null;
//     }

//     const user = users[0];

//     // Compare the hashed password with the provided password
//     const isMatch = password === user.password ? true : false;
    
//     if (!isMatch) {
//         return null;
//     }
//     // // Generate JWT token
//     // const Token = GenerateToken(user.email)

    
//     return { user}; // Return user details (not the password)
// };


// export default loginUser;

const loginUser = async (email, password) => {
    try {
      // Send a POST request to the backend login route
      const response = await fetch('https://ecommerce-login-api.netlify.app/.netlify/functions/login', {  // URL of your backend login route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),  // Sending the login credentials to the server
      });
  
      // Parse the response JSON
      const data = await response.json();
  
      // Check if the response was successful (i.e., the API returns success: true)
      if (response.ok && data.success) {
        return data;  // Return the response object, which contains the token and user info
      } else {
        throw new Error(data.message || 'Login failed');  // If something goes wrong, throw an error
      }
    } catch (error) {
      console.error('Login failed:', error);
      return null;  // Return null if there was an error during the API call
    }
  };
  export default loginUser;