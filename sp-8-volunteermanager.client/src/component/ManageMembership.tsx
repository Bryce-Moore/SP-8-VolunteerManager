// src/components/ManageMembership.tsx
import React from 'react';
import axios from 'axios';
import common from '../styles/Common.module.css';

interface ManageMembershipProps {
  currentGroupId: string;
  onGroupLeft: () => void;
}

const accountID = sessionStorage.getItem('accountID');

const ManageMembership: React.FC<ManageMembershipProps> = ({ currentGroupId, onGroupLeft }) => {
  const leaveGroup = async () => {
    try {
      // DELETE method for leaving the group
      await axios.delete(`http://10.69.40.5:8000/api/group/${currentGroupId}/leave/`, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
            accountID: accountID,
        },
      });

      alert('You have left the group.');
      onGroupLeft();
    } catch (error) {
      console.error("Failed to leave group", error);
      alert('Failed to leave the group. Please try again.');
    }
  };

  return (
    <div className={common.container}>
      <h2 className={common.title}>Manage Membership</h2>
      <button className={common.removeButton} onClick={leaveGroup}>Leave Group</button>
    </div>
  );
};

export default ManageMembership;
