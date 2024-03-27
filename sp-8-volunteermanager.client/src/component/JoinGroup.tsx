import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const JoinGroup = () => {
  const [groupCode, setGroupCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const auth_token = sessionStorage.getItem('auth_token');

    setIsLoading(true);
    setError('');

    try {
      await axios.post('http://10.69.40.5:8000/api/group/join/', { // POST join group form (invite code + auth token)
        invite_code: groupCode,
        auth_token: auth_token,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert('Joined group successfully!');
      navigate('/dashboard', { replace: true }); // Use replace to navigate without pushing a new entry onto the history stack
      window.location.reload(); // This forces the page to reload, which in turn refreshes the groups state
    } catch (error) {
      console.error('Failed to join group', error);
      setError('Failed to join group. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Join a Group</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="groupCode">Group Code:</label>
          <input
            id="groupCode"
            type="text"
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Joining...' : 'Join Group'}
        </button>
      </form>
    </div>
  );
};

export default JoinGroup;