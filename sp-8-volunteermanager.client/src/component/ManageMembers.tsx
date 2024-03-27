// src/components/ManageMembers.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Member {
  account_id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  currentGroupId: string;
}

const ManageMembers: React.FC<Props> = ({ currentGroupId }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const auth_token = sessionStorage.getItem('auth_token');

  useEffect(() => {
    
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`http://10.69.40.5:8000/api/group/members`, { // Fetch all members of this group
          params: {
            group_id: currentGroupId,
            auth_token: auth_token,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Fetched members: ', response.data);
        setMembers(response.data);
      } catch (error) {
        console.error("Failed to fetch group members", error);
      }
    };

    fetchMembers();
  }, [currentGroupId]);

  // Remove the user from the group
  const removeMember = async (id: string, email: string) => {
    try {
      await axios.delete(`http://10.69.40.5:8000/api/group/${currentGroupId}/members/remove/${id}/`, { // Remove the user from the group (delete the entry on user_group)
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert(`Member ${email} removed successfully.`);
      setMembers(members.filter(member => member.account_id !== id)); // Remove the member from the state
    } catch (error) {
      console.error("Failed to remove member", error);
      alert('Failed to remove the member. Please try again.');
    }
  };

  // Promote the user to admin within the group
  const promoteMember = async (id: string, email: string) => {
    try {
      await axios.patch(`http://10.69.40.5:8000/api/group/${currentGroupId}/members/promote/${id}/`, { // Promote the user's role from 'user' to 'admin'
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert(`Member ${email} promoted to admin successfully.`);
      setMembers(members.map(member => member.account_id === id ? { ...member, role: 'admin' } : member)); // Update the user's role in the state
    } catch (error) {
      console.error("Failed to promote member", error);
      alert('Failed to promote the member. Please try again.');
    }
  };
  return (
    <div>
        <h2>Group Members</h2>
        <ul>
          {members.map((member, index) => (
              <li key={index}>
                  {member.firstName} {member.lastName} ({member.email})
                  <button onClick={() => removeMember(member.account_id, member.email)}>Remove</button>
                  {<button onClick={() => promoteMember(member.account_id, member.email)}>Promote</button>}
              </li>
          ))}
        </ul>
    </div>
  );
};

export default ManageMembers;
