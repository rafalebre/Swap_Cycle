import React, { useState } from 'react';
import Home from './pages/Home';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import './App.css';
import { login, register } from './services/authService'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleLoginModal = () => setShowLoginModal(!showLoginModal);
  const handleRegisterModal = () => setShowRegisterModal(!showRegisterModal);

  const handleLogin = async (email, password) => {
    try {
      const data = await login(email, password);
      console.log('Login successful:', data);
      setIsLoggedIn(true);
      setShowLoginModal(false);
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  const handleLogout = () => {
    // Aqui simulará o logout
    console.log("Logout");
    setIsLoggedIn(false);
  };

  const handleRegister = async (email, username, password) => {
    try {
      const data = await register(email, username, password);
      console.log('Registration successful:', data);
      setShowRegisterModal(false);
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  };

  return (
    <div>
      <Home
        isLoggedIn={isLoggedIn}
        onLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onRegister={() => setShowRegisterModal(true)}
      />
      {showLoginModal && <LoginModal onClose={handleLoginModal} onLogin={handleLogin} />}
      {showRegisterModal && <RegisterModal onClose={handleRegisterModal} onRegister={handleRegister} />}
    </div>
  );
}

export default App;
