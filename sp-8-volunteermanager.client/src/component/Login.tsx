import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      const response = await axios.post('http://10.69.40.5:8000/api/auth', credentials);
      
      // Extract the auth_token from the response
      const { auth_token } = response.data;
      
      // Save the auth_token to local storage
      localStorage.setItem('auth_token', auth_token);

      if (auth_token) {
        // Set the token in the axios header
        axios.defaults.headers.common['Authorization'] = `Bearer ${auth_token}`;
      }

      alert('Login successful!');
      console.log('Login successful!');
      
      // Redirect the user to the dashboard
      navigate('/dashboard');
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
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={credentials.email} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={credentials.password} 
          onChange={handleChange} 
          required 
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
  
export default Login;