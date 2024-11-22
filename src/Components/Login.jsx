import React, { useState } from 'react';
// import Box from '@mui/material/Box';
// import Container from '@mui/material/Container';
// import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
// import { Button } from '@mui/material';
// import { Link, useNavigate } from 'react-router-dom';
// function Login() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const handleSubmit = async (event) => {
//     event.preventDefault(); // Prevent form submission
  
//     try {
//       const response = await fetch('/.netlify/functions/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });
  
//       // Check if the response is OK (status code 200)
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
  
//       // Parse the response JSON
//       const data = await response.json();
//       console.log(data); // Log the response data
  
//       // Check if the login was successful
//       if (data.success) {
//         const { token, user } = data; // Extract the token and user details
  
//         // Store the token and user details in sessionStorage
//         sessionStorage.setItem('authToken', token);
//         sessionStorage.setItem('user', JSON.stringify(user));
  
//         // Navigate to the Dashboard (or another page)
//         navigate('/dashboard'); // Use correct path for your Dashboard
//       } else {
//         alert('Please enter valid user details');
//       }
//     } catch (error) {
//       console.error('Error during login:', error);
//       alert('An error occurred while logging in. Please try again later.');
//     }
//   };
//   return (
//     <Container maxWidth="sm">
//       <Box
//         component="form"
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           '& > :not(style)': { m: 1, width: '25ch' },

//         }}

//         onSubmit={handleSubmit}
//         autoComplete="off"
//       >
//         <Typography variant="h4" sx={{ color: '#891214', marginBottom: 2 }}>
//             Login to E-Commerce
//         </Typography>
//         <TextField id="username" label="Username" variant="outlined"
//             onChange={(e) => setEmail(e.target.value)}
//         />
//         <TextField
//           id="password"
//           label="Password"
//           type="password"
//           autoComplete="current-password"
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <Button type='submit' variant="contained">Login</Button>
//         <Typography variant="body2" sx={{ marginTop: 2 }}>
//           Don't have an account?{' '}
//           <Link to="/SignUp" style={{ textDecoration: 'none', color: '#891214' }}>
//             Sign Up
//           </Link>
//         </Typography>
//       </Box>
//     </Container>
//   );
// }

// export default Login;

// import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import {FormLabel, CircularProgress} from '@mui/material';
import FormControl from '@mui/material/FormControl';
// import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
// import ForgotPassword from './ForgotPassword';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './CustomIcons';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';

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

export default function SignIn(props) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);



    const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form submission
  
    try {
      setLoading(true);
      const response = await fetch('https://ecommerce-login-api.netlify.app/.netlify/functions/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });
  
      // Check if the response is OK (status code 200)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Parse the response JSON
      const data = await response.json();
      console.log(data); // Log the response data
  
      // Check if the login was successful
      if (data.success) {
        const { token, user } = data;

        // Store token and user details in sessionStorage
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('user', JSON.stringify(user));
        console.log(user);
        // Navigate to the Dashboard
        navigate('/dashboard');
      } else {
        alert('Please enter valid user details');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error during login:', error);
      alert('An error occurred while logging in. Please try again later.');
    }finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }
  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
                onChange={(e) => setEmail(e.target.value)}

              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Sign in
            </Button>
          
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
           
            <Typography sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
           <Link to="/SignUp" style={{ textDecoration: 'none', color: '#891214' }}>
             Sign Up
           </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}