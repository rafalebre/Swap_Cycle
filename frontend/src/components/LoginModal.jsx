import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importando useAuth

const LoginModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth(); // Usando login do contexto
  const navigate = useNavigate(); // Adicionando useNavigate para redirecionamento

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      onClose(); // Fechar modal após login
      navigate('/dashboard'); // Navegação para o Dashboard
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button type="submit">Login</button>
        <button type="button" onClick={onClose}>Close</button>
      </form>
    </div>
  );
};

export default LoginModal;
