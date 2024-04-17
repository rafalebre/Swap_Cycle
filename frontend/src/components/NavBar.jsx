
import React from 'react';

const NavBar = ({ isLoggedIn, onLogin, onLogout, onRegister }) => {
  return (
    <nav>
      <div className="logo">Logo</div>
      <div className="menu">
        {isLoggedIn ? (
          <>
            <button onClick={onLogout}>Logout</button>
            <button>My Info</button>
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
