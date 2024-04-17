import React from 'react';
import { createRoot } from 'react-dom/client'; // Importa createRoot - React 18 ou superior
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';

const container = document.getElementById('root'); // Obtém o container
const root = createRoot(container); // Cria o root

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// Medir a performance do app - passar o console.log para ver a performance no console
reportWebVitals();
