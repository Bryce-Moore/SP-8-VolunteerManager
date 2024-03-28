import { useState } from 'react';
import Login from '../component/Login';
import Register from '../component/Register';
import homeStyles from '../styles/Home.module.css';
import buttonStyles from '../styles/TextButton.module.css';
function Home() {
  const [showLogin, setShowLogin] = useState(true); // State of the Login component

  // Function to toggle between login and register
  const toggleForm = () => setShowLogin(!showLogin);

    return (
        <div className={homeStyles.homeContainer}>
            <div className={homeStyles.contentBox}>
                {showLogin ? <Login /> : <Register onRegistrationSuccess={toggleForm} />} {/* Displays either the Login or Register form based on state */}
                <button className={buttonStyles.textButton}  onClick={toggleForm}>
                    {showLogin ? "Not registered? Make an account." : "Back to login."}
                </button>
            </div>
        </div>
    );
}

export default Home;