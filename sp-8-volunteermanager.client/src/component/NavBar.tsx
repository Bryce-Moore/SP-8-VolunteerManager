import React from 'react';

const NavBar = () => {
  const handleLogout = () => {
    // Clear session storage
    sessionStorage.clear();
    
    // Refresh the app, which could redirect the user to the login page or home
    window.location.assign('/');
  };

  return (
    <nav>
            <button onClick={handleLogout}>Log Out</button>
    </nav>
  );
};

export default NavBar;