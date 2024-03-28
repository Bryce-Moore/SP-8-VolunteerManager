import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Register.module.css';
interface RegisterProps {
  onRegistrationSuccess: () => void;
}

function Register({ onRegistrationSuccess }: RegisterProps) {
  // The fields of the form in a state variable
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    security_question_1: '',
    security_question_2: '',
    phone_number: ''
  });

  // Function for updating the form state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // POST the form to the backend
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Use axios.post for the submission
      const response = await axios.post('http://10.69.40.5:8000/api/auth/reg', formData, {
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers here
        }
      });

      // Successful submission
      const { account_id } = response.data;
      
      // Save the accountID to session storage
      sessionStorage.setItem('account_id', account_id);

      alert('Registration successful!');
      onRegistrationSuccess(); // Call the function passed as a prop to switch back to login view
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handling Axios errors
        console.error('Axios error:', error.response?.data || error.message);
        alert(`Registration failed: ${error.response?.data.message || error.message}`);
      } else {
        // Handling unexpected errors
        console.error('Unexpected error:', error);
        alert('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div>
      <h1>Register</h1>
          <form className={styles.form}  onSubmit={handleSubmit}>
        <input className={styles.input} type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input className={styles.input} type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input className={styles.input} type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
        <input className={styles.input} type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
        <input className={styles.input} type="text" name="security_question_1" placeholder="Security Question 1" value={formData.security_question_1} onChange={handleChange} required />
        <input className={styles.input} type="text" name="security_question_2" placeholder="Security Question 2" value={formData.security_question_2} onChange={handleChange} required />
        <input className={styles.input} type="tel" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} required />
        <button className={styles.button} type="submit">Register</button>
      </form>
    </div>
  );
}
  
export default Register;