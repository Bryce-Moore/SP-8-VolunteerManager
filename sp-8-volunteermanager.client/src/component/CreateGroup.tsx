// CreateGroup.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import common from '../styles/Common.module.css';

const CreateGroup = () => {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Retrieve the auth token from session storage
    const authToken = sessionStorage.getItem('auth_token');

    setIsLoading(true);
    setError('');

    // Post the new group form 
    try {
      await axios.post('http://10.69.40.5:8000/api/group/new/', {
        name: groupName,
        description: groupDescription,
        auth_token: authToken,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`Group ${groupName} created.`)

      // Clear the form and navigate the user away upon successful creation
      setGroupName('');
      setGroupDescription('');
      alert('Group created successfully!');
      navigate('/dashboard'); //Navigate back to the dashboard to refresh the groups

    } catch (error) {
      console.error('Failed to create group', error);
      setError('Failed to create group. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={common.container}>
      <h2 className={common.title}>Create a New Group</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} className={common.centerForm}>
        <div className={common.centerDiv}> 
          <label htmlFor="groupName" className={common.inputName}>Group Name:</label>
          <input
            id="groupName"
            type="text"
            className={common.input}
            placeholder="Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
        </div>
        <div className={common.centerDiv}>
          <label htmlFor="groupDescription" className={common.inputName}>Group Description:</label>
          <textarea
            id="groupDescription"
            className={common.input}
            placeholder="Description"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading} className={common.button}>
          {isLoading ? 'Creating...' : 'Create Group'}
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;
