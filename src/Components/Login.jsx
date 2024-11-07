import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import loginUser from '../netlify/loginUser';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Call loginUser to authenticate the user
    const { user, token } = await loginUser(email, password);

    if (user && token) {
      // Store the JWT token in localStorage (or sessionStorage)
      localStorage.setItem('authToken', token); // Store token in localStorage
      // Navigate to Dashboard
      navigate('/dashboard');
    } else {
      // Show alert for invalid user details
      alert('Invalid email or password');
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
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained">
          Login
        </Button>
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
