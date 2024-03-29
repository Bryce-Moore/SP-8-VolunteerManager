import { useState, useEffect } from 'react';
import styles from '../styles/Navbar.module.css';

const NavBar = () => {
  
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('auth_token') !== null); // To determine if the user's logged in

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(sessionStorage.getItem('auth_token') !== null);
    };

    // Event listener for changes in session storage
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);  

  const handleLogout = () => {

    // Clear session storage
    sessionStorage.clear();
    
    // Refresh the app, which could redirect the user to the login page or home
    window.location.assign('/');
  };

  return (
    <nav className={styles.background}>
      <h1 className={styles.title}>Volunteer Manager App</h1>

      {isLoggedIn && ( 
        <button className={styles.button} onClick={handleLogout}>Log Out</button> 
      )}
      
    </nav>
  );
};

export default NavBar;