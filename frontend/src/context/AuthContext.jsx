import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      localStorage.setItem('token', data.access_token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  };

  const register = async (email, username, password) => {
    try {
      const response = await fetch('http://localhost:5001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      localStorage.setItem('token', data.access_token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Registration error:', error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
