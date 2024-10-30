import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import registerUser from '../netlify/signUp'


function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');


  const handleSubmit = async (event) =>{
    event.preventDefault();
    const userDetails = await registerUser(email, password,fullName);
    userDetails != null ?  navigate('../') : alert('Please enter valid user details')
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
            sign Up to E-Commerce
        </Typography>
        <TextField id="fullName" label="Full Name" variant="outlined"
            onChange={(e) => setFullName(e.target.value)}
        />
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
        <Button type='submit' variant="contained">Sign Up</Button>
        <Link to="/" style={{ textDecoration: 'none', color: '#891214' }}>
           Cancel
        </Link>
      </Box>
    </Container>
  );
}

export default SignUp;
