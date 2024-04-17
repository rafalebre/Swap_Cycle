import React, { useState } from 'react';
import Home from './pages/Home';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleLoginModal = () => setShowLoginModal(!showLoginModal);
  const handleRegisterModal = () => setShowRegisterModal(!showRegisterModal);

  const handleLogin = (email, password) => {
    // Aqui você simulará o login
    console.log(`Login attempted with email: ${email} and password: ${password}`);
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    // Aqui você simulará o logout
    console.log("Logout");
    setIsLoggedIn(false);
  };

  const handleRegister = (email, username, password) => {
    // Aqui você simulará o registro
    console.log(`Registration attempted with email: ${email}, username: ${username}, and password: ${password}`);
    setShowRegisterModal(false);
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
