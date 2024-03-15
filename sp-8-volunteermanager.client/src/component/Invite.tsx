import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  currentGroupId: string; 
}

const Invite: React.FC<Props> = ({ currentGroupId }) => { // Pass the current group ID as a prop
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInviteCode = async () => {
      if (!currentGroupId) return; // if currentGroupId is not set

      setIsLoading(true);
      setError('');

      try {
        const response = await axios.get(`http://10.69.40.5:8000/api/group/${currentGroupId}/invite/`, { // Fetch the invite code
          headers: { 'Content-Type': 'application/json' },
        });
        setInviteCode(response.data.inviteCode);
      } catch (error) {
        console.error('Failed to fetch invite code', error);
        setError('Failed to fetch invite code. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInviteCode();
  }, [currentGroupId]); // Refetch when currentGroupId changes

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode).then(
      () => {
        alert('Invite code copied to clipboard!');
      },
      (err) => {
        console.error('Failed to copy invite code: ', err);
      }
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Group Invite Code</h2>
      <p>{inviteCode}</p>
      <button onClick={handleCopy}>Copy Invite Code</button>
    </div>
  );
};

export default Invite;