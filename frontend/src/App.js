import React, { useState } from 'react';
import Home from './pages/Home';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import './App.css';
import { useAuth } from './context/AuthContext';

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const { isLoggedIn, login, logout } = useAuth();

  const handleLoginModal = () => setShowLoginModal(!showLoginModal);
  const handleRegisterModal = () => setShowRegisterModal(!showRegisterModal);

  return (
    <div>
      <Home
        isLoggedIn={isLoggedIn}
        onLogin={() => setShowLoginModal(true)}
        onLogout={logout}
        onRegister={() => setShowRegisterModal(true)}
      />
      {showLoginModal && <LoginModal onClose={handleLoginModal} onLogin={login} />}
      {showRegisterModal && <RegisterModal onClose={handleRegisterModal} onRegister={() => {}} />}
    </div>
  );
}

export default App;
