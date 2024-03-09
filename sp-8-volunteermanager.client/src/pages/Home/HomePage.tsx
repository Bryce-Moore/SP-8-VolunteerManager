import React from 'react';
import styles from './homePage.module.css'; 

const HomePage = () => {
    return (
        <div className={styles.container}>
            <h1>SP 8 Volunteer Manager</h1>
            <button className={styles.loginButton}>Login</button>
        </div>
    );
};

export default HomePage;
