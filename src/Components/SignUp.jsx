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
  const [mobileNo, setMobileNo] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');



  const handleSubmit = async (event) =>{
    event.preventDefault();
    const userDetails = await registerUser(email, password,fullName,mobileNo,address,2);
    console.log(userDetails);
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
            autoComplete="Full Name" 
            onChange={(e) => setFullName(e.target.value)}
        />
        <TextField id="username" label="Username"  autoComplete="User Name" variant="outlined"
            onChange={(e) => setEmail(e.target.value)}
        />
         <TextField id="mobileNo" label="Mobile No" variant="outlined"
            onChange={(e) => setMobileNo(e.target.value)}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="new password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Address"
          name="address"
          onChange={(e) => setAddress(e.target.value)}
          multiline  // Enable multi-line input
          rows={4}   // Default number of rows (lines) shown
          rowsMax={6} // Max number of rows (lines) before the textarea becomes scrollable
          variant="outlined"
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
