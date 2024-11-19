// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for token in localStorage or sessionStorage
    const token = sessionStorage.getItem('authToken');
    const userData = sessionStorage.getItem('user');

    if (token) {
      setAuthToken(token);
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = (token, user) => {
    setAuthToken(token);
    setUser(user);
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
