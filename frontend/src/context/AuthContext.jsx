import React, { createContext, useState, useContext, useEffect } from 'react';


const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const API_URL = process.env.REACT_APP_API_URL; // Add this line

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    // Checa o token no carregamento
    checkToken();

    // Adiciona ouvinte para mudanças na localStorage
    window.addEventListener('storage', checkToken);

    // Remove o ouvinte ao desmontar o componente
    return () => window.removeEventListener('storage', checkToken);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, { // Modify this line
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
      const response = await fetch(`${API_URL}/auth/register`, { // Modify this line
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
