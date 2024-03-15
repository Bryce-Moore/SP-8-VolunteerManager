import { useState } from 'react';
import Login from '../component/Login';
import Register from '../component/Register';

function Home() {
  const [showLogin, setShowLogin] = useState(true); // State of the Login component

  // Function to toggle between login and register
  const toggleForm = () => setShowLogin(!showLogin);

  return (
    <div>
      <h1>Welcome!</h1>
      <p>Please login or register to continue.</p>
      {showLogin ? <Login /> : <Register onRegistrationSuccess={toggleForm}/>} {/* Displays either the Login or Register form based on state */}
      <button onClick={toggleForm}> {/* Button for toggling between login and register */}
        {showLogin ? "Not registered? Make an account." : "Back to login."}
      </button>
    </div>
  );
}

export default Home;