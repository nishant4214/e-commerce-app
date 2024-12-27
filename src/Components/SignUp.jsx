import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import registerUser from '../netlify/signUp'
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import CssBaseline from '@mui/material/CssBaseline';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

function SignUp(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');



  const handleSubmit = async (event) =>{
    event.preventDefault();
    const response = await fetch('https://ecommerce-login-api.netlify.app/.netlify/functions/encryptPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();

    // Check if the response is OK (status code 200)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const userDetails = await registerUser(email, data.encPass,fullName,mobileNo,address,2);
    userDetails != null ?  navigate('../') : alert('Please enter valid user details')
  };
  
  return (
    <AppTheme {...props}>
    <CssBaseline enableColorScheme />
    <SignInContainer direction="column" justifyContent="space-between">
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />  
    <Container maxWidth="sm">
    <Card variant="outlined">
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
            Sign Up to E-Commerce
        </Typography>
        <TextField id="fullName" label="Full Name" variant="outlined"
            autoComplete="Full Name" 
            onChange={(e) => setFullName(e.target.value)}
            inputProps={{ maxLength: 100 }} // Maximum length for the password

        />
        <TextField id="username" label="Email Id"  autoComplete="Email ID" variant="outlined"
            onChange={(e) => setEmail(e.target.value)}
            inputProps={{ maxLength: 50 }} // Maximum length for the password

        />
         <TextField id="mobileNo" label="Mobile No" variant="outlined"
            onChange={(e) => setMobileNo(e.target.value)}
            inputProps={{ maxLength: 13 }} // Maximum length for the password
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="new password"
          onChange={(e) => setPassword(e.target.value)}
          inputProps={{ maxLength: 15 }} 
        />
        <TextField
          fullWidth
          margin="normal"
          label="Address"
          name="address"
          onChange={(e) => setAddress(e.target.value)}
          variant="outlined"
          inputProps={{ maxLength: 200 }} 
        />

        <Button type='submit' variant="contained">Sign Up</Button>
        <Link to="/Login" style={{ textDecoration: 'none', color: '#891214' }}>
           Cancel
        </Link>
        <Link to='/' style={{ textDecoration: 'none', color: '#891214' }}>Go to Home</Link>

      </Box>
      </Card>
    </Container>
    </SignInContainer>
    </AppTheme>
  );
}

export default SignUp;
