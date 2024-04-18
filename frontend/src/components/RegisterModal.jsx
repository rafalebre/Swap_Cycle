import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Importando useAuth

const RegisterModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('')
  const { register } = useAuth(); // Usando register do contexto

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await register(email, username, password);
      onClose(); // Fechar modal após registro
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleRegister}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <label>Confirm Password:</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button type="submit">Register</button>
        <button type="button" onClick={onClose}>Close</button>
      </form>
    </div>
  );
};

export default RegisterModal;
