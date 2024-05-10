import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importação necessária para a navegação
import "./NavBar.css";

const NavBar = ({ isLoggedIn, onLogin, onLogout, onRegister }) => {
  const navigate = useNavigate(); // Hook para a navegação

  return (
    <nav>
      <div className="logo">Logo</div>
      <div className="menu">
        {isLoggedIn ? (
          <>
            <button onClick={onLogout}>Logout</button>
            <button onClick={() => navigate('/update-info')}>My Info</button>  
          </>
        ) : (
          <>
            <button onClick={onRegister}>Register</button>
            <button onClick={onLogin}>Login</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
