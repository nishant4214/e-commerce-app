import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
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
      const response = await axios.post('https://your-api-endpoint/reset-password', { token, newPassword });
      setMessage(response.data.message);
      setError('');
    } catch (error) {
      setError(error.response.data.error || 'Something went wrong');
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Reset Your Password</h2>

      {tokenValid ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Reset Password</button>
        </form>
      ) : (
        <p>{error || 'Invalid or expired token.'}</p>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
