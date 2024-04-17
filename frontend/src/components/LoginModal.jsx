import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Importando useAuth

const LoginModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // Usando login do contexto

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      onClose(); // Fechar modal após login
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
        <button type="button" onClick={onClose}>Close</button>
      </form>
    </div>
  );
};

export default LoginModal;
