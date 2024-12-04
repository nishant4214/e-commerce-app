import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Box from '@mui/material/Box';

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
const ResetPassword = (props) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Get the token from the URL

  useEffect(() => {
    // Verify the reset token when the page loads
    const verifyToken = async () => {
      try {
        const response = await axios.get(`https://ecommerce-login-api.netlify.app/.netlify/functions/verifyResetToken?token=${token}`);
        console.log(response);
        if (response.data.valid) {
          setTokenValid(true);
        } else {
          setError('Invalid or expired token');
        }
      } catch (error) {
        setError('Error verifying token');
      }
    };
    verifyToken();
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!newPassword || newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('https://ecommerce-login-api.netlify.app/.netlify/functions/resetPassword', { token, newPassword });
      setMessage(response.data.message);
      setError('');
    } catch (error) {
      setError(error.response.data.error || 'Something went wrong');
      setMessage('');
    }
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
                Reset Your Password
              </Typography>

              {tokenValid ? (
                <>
                  <TextField
                    id="newPassword"
                    label="New Password"
                    type="password"
                    variant="outlined"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <TextField
                    id="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
                    Reset Password
                  </Button>
                </>
              ) : (
                <Typography variant="body1" sx={{ color: 'red', marginTop: 2 }}>
                  {error || 'Invalid or expired token.'}
                </Typography>
              )}

              {message && (
                <Typography variant="body2" sx={{ color: 'green', marginTop: 2 }}>
                  {message}
                </Typography>
              )}

              <Link to="/" style={{ textDecoration: 'none', color: '#891214', marginTop: 2 }}>
                Cancel
              </Link>
            </Box>
          </Card>
        </Container>
      </SignInContainer>
    </AppTheme>
  );
};

export default ResetPassword;
