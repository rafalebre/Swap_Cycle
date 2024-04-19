import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import UserInfo from './pages/UserInfo';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import NavBar from './components/NavBar';
import { useAuth } from './context/AuthContext';

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { isLoggedIn, login, logout, register } = useAuth();

  const handleLoginModal = () => setShowLoginModal(!showLoginModal);
  const handleRegisterModal = () => setShowRegisterModal(!showRegisterModal);

  return (
    <Router>
      <NavBar
        isLoggedIn={isLoggedIn}
        onLogin={() => setShowLoginModal(true)}
        onLogout={logout}
        onRegister={() => setShowRegisterModal(true)}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate replace to="/" />} />
        <Route path="/update-info" element={isLoggedIn ? <UserInfo /> : <Navigate replace to="/" />} />
      </Routes>
      {showLoginModal && <LoginModal onClose={handleLoginModal} onLogin={login} navigatePath="/dashboard" />}
      {showRegisterModal && <RegisterModal onClose={handleRegisterModal} onRegister={register} navigatePath="/update-info" />}
    </Router>
  );
}

export default App;
