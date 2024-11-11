
const loginUser = async (email, password) => {
    try {
      // Send a POST request to the backend login route
      const response = await fetch('https://ecommerce-login-api.netlify.app/.netlify/functions/login', {  // URL of your backend login route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Allow cookies to be sent with the request
        mode: 'no-cors',  // This bypasses CORS but you can't access the response body
      });
  
      // Parse the response JSON
      const data = await response.json();
      console.log(data)

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