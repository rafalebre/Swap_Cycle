import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import { LoadScript } from '@react-google-maps/api';

const container = document.getElementById('root');
const root = createRoot(container);

const libraries = ['places']; // Defina as bibliotecas aqui para evitar redefinições

const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

root.render(
  <React.StrictMode>
    <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </LoadScript>
  </React.StrictMode>
);

reportWebVitals();