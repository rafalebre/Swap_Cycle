// src/App.js
import React, { useState } from 'react';
import Home from './pages/Home';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Aqui você adicionará a lógica para login
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Aqui você adicionará a lógica para logout
    setIsLoggedIn(false);
  };

  const handleRegister = () => {
    // Aqui você adicionará a lógica para mostrar o modal de registro
  };

  return (
    <Home
      isLoggedIn={isLoggedIn}
      onLogin={handleLogin}
      onLogout={handleLogout}
      onRegister={handleRegister}
    />
  );
}

export default App;

