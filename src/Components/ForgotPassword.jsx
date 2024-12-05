import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
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
function PasswordGuidelines({ password }) {
  return (
    <Box>
      <Typography variant="caption" sx={{ color: password.length >= 8 && password.length <= 15 ? 'green' : 'red' }}>
        • 8-15 characters
      </Typography>
      <br />
      <Typography variant="caption" sx={{ color: /[A-Z]/.test(password) ? 'green' : 'red' }}>
        • At least one uppercase letter
      </Typography>
      <br />
      <Typography variant="caption" sx={{ color: /[a-z]/.test(password) ? 'green' : 'red' }}>
        • At least one lowercase letter
      </Typography>
      <br />
      <Typography variant="caption" sx={{ color: /[0-9]/.test(password) ? 'green' : 'red' }}>
        • At least one number
      </Typography>
      <br />
      <Typography variant="caption" sx={{ color: /[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'green' : 'red' }}>
        • At least one special character (!@#$%^&*)
      </Typography>
    </Box>
  );
}
function ForgotPassword(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://ecommerce-login-api.netlify.app/.netlify/functions/sendResetEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset OTP sent to your email!');
        setIsOtpSent(true);
      } else {
        setMessage(data.message || 'An error occurred');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error while sending reset email.');
    }
  };

  const validatePassword = (password) => {
    return (
      password.length >= 8 &&
      password.length <= 15 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
  };
  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();

    // Validate OTP
    if (!/^\d{6}$/.test(otp)) {
      setMessage('OTP must be a 6-digit number.');
      return;
    }

    const isValidPassword = validatePassword(newPassword);

    if (!isValidPassword) {
      setMessage('Password does not meet the required criteria.');
      return;
    }

    // Validate new password length
    if (newPassword.length < 8 || newPassword.length > 15) {
      setMessage('Password must be between 8 to 15 characters.');
      return;
    }

    // Validate new password length
    if (confirmPassword.length < 8 || confirmPassword.length > 15) {
      setMessage('Password must be between 8 to 15 characters.');
      return;
    }

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setMessage('New Password and Confirm Password must match.');
      return;
    }

    try {
      const response = await fetch('https://ecommerce-login-api.netlify.app/.netlify/functions/resetPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password successfully reset!');
        navigate('/');
      } else {
        setMessage(data.message || 'An error occurred during password reset');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error while resetting password.');
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
              onSubmit={isOtpSent ? handlePasswordResetSubmit : handleEmailSubmit}
              autoComplete="off"
            >
              <Typography variant="h4" sx={{ color: '#891214', marginBottom: 2 }}>
                {isOtpSent ? 'Reset Your Password' : 'Forgot Password'}
              </Typography>

              {!isOtpSent ? (
                <>
                  <TextField
                    id="email"
                    label="Email Id"
                    autoComplete="Email ID"
                    variant="outlined"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button type="submit" variant="contained">
                    Send OTP
                  </Button>
                </>
              ) : (
                <>
                  <TextField
                    id="otp"
                    label="Enter OTP"
                    variant="outlined"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    autoComplete="off"
                    inputProps={{ maxLength: 6 }} // Maximum length for the password
                    
                  />
                  <TextField
                    id="newPassword"
                    label="New Password"
                    type="password"
                    variant="outlined"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="off"
                    inputProps={{ maxLength: 15 }} // Maximum length for the password

                  />
                  <PasswordGuidelines password={newPassword} />

                  <TextField
                    id="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="off"
                    inputProps={{ maxLength: 15 }} // Maximum length for the password
                  />
                  <Button type="submit" variant="contained">
                    Reset Password
                  </Button>
                </>
              )}

              {message && <p>{message}</p>}

              {!isOtpSent && (
                <Link to="/" style={{ textDecoration: 'none', color: '#891214' }}>
                  Cancel
                </Link>
              )}
            </Box>
          </Card>
        </Container>
      </SignInContainer>
    </AppTheme>
  );
}

export default ForgotPassword;
