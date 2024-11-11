import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import registerUser from '../netlify/signUp'
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form submission
  
    try {
      const response = await axios.post(
        'https://ecommerce-login-api.netlify.app/.netlify/functions/login',
        {
          email: email,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',  // Explicitly set Content-Type as JSON
          },
          // Axios automatically doesn't send credentials unless specified
          // Since you're not using cookies, no need to add `credentials` like in fetch.
        });

      console.log(response);
  
      // Check if the response is OK (status code 200)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Parse the response JSON
      const data = await response.json();
      console.log('Response data:', data);
  
      // Check if the login was successful
      if (data.success) {
        const { token, user } = data; // Extract the token and user details
  
        // Store the token and user details in sessionStorage
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('user', JSON.stringify(user));
  
        // Navigate to the Dashboard (or another page)
        navigate('./Dashboard');
      } else {
        alert('Please enter valid user details');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred while logging in. Please try again later.');
    }
  };
  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          '& > :not(style)': { m: 1, width: '25ch' },

        }}

        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <Typography variant="h4" sx={{ color: '#891214', marginBottom: 2 }}>
            Login to E-Commerce
        </Typography>
        <TextField id="username" label="Username" variant="outlined"
            onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type='submit' variant="contained">Login</Button>
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          Don't have an account?{' '}
          <Link to="/SignUp" style={{ textDecoration: 'none', color: '#891214' }}>
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default Login;
