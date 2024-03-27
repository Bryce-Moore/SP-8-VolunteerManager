const NavBar = () => {
  
  const isLoggedIn = sessionStorage.getItem('auth_token') !== null; // To determine if the user's logged in

  const handleLogout = () => {

    // Clear session storage
    sessionStorage.clear();
    
    // Refresh the app, which could redirect the user to the login page or home
    window.location.assign('/');
  };

  return (
    <nav>
      <h1>Volunteer Manager App</h1> {/* placeholder title/logo */}

      {/* Logout button is conditionally rendered */}
      {isLoggedIn && ( 
        <button onClick={handleLogout}>Log Out</button> 
      )}
      
    </nav>
  );
};

export default NavBar;