import React from 'react';
import NavBar from '../components/NavBar';

const Home = ({ isLoggedIn, onLogin, onLogout, onRegister }) => {
  return (
    <div>
      <NavBar
        isLoggedIn={isLoggedIn}
        onLogin={onLogin}
        onLogout={onLogout}
        onRegister={onRegister}
      />
      <h1>Welcome to Our App!</h1>
      <img src="path/to/your/image.jpg" alt="How it works" />
      <footer>This is the footer</footer>
    </div>
  );
};

export default Home;
