// src/component/Login.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css';

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' }); // State for managing form fields
  const navigate = useNavigate();

  // Function for updating the form state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form function
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Sending the login credentials to the backend
      const response = await axios.post('http://10.69.40.5:8000/api/auth/', credentials, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      // Extract the auth_token from the response
      const { auth_token, account_id } = response.data;
      
      // Save the auth_token + account_id to session storage
      sessionStorage.setItem('auth_token', auth_token);
      sessionStorage.setItem('account_id', account_id);

      alert('Login successful!');
      console.log('Login successful!');
      
      // Redirect the user to the dashboard
      console.log('Navigating to Dashboard.tsx')
      navigate('/dashboard/submit-shifts');
      window.location.reload();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle errors returned from the server
        alert(`Login failed: ${error.response?.data.message || 'An error occurred'}`);
        console.log(`Login failed: ${error.response?.data.message || 'An error occurred'}`)
      } else {
        // Handle other errors
        alert('Login failed. Please try again.');
        console.log('Login failed. Please try again.');
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
        <input
            className={styles.input}
            type="email" 
            name="email" 
            placeholder="Email" 
            value={credentials.email} 
            onChange={handleChange} 
            required 
        />
        <input 
            className={styles.input}
            type="password" 
            name="password" 
            placeholder="Password" 
            value={credentials.password} 
            onChange={handleChange} 
            required 
        />
        <button className={styles.button} type="submit">Login</button>
        </form>
    </div>
  );
}
  
export default Login;