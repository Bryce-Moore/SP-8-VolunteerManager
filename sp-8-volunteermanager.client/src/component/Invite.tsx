import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  currentGroupId: string; 
}

const Invite: React.FC<Props> = ({ currentGroupId }) => { // Pass the current group ID as a prop
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const auth_token = sessionStorage.getItem('auth_token');
  const account_id = sessionStorage.getItem('account_id');

  useEffect(() => {
    const fetchInviteCode = async () => {
      
      setIsLoading(true); // Set loading to true at the start of the operation
      setError(''); // Clear any previous errors
      
      console.log("Current Group ID inside Invite:", currentGroupId);

      try {
        const response = await axios.get(`http://10.69.40.5:8000/api/group/invite`, { 
          params: {
            group_id: currentGroupId,
            auth_token: auth_token,
            account_id: account_id,
          },
          headers: { 'Content-Type': 'application/json' },
        });
        console.log('Invite code fetched:', response.data.invite_code);
        setInviteCode(response.data.invite_code); // Assume your backend is structured to return { inviteCode: "someCode" }
      } catch (error) {
        console.error('Failed to fetch invite code', error);
        setError('Failed to fetch invite code. Please try again.');
      } finally {
        setIsLoading(false); // Ensure loading is set to false after the operation completes
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