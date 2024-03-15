// src/components/ManageMembers.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user';
}

interface Props {
  currentGroupId: string;
}

const ManageMembers: React.FC<Props> = ({ currentGroupId }) => {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`http://10.69.40.5:8000/api/group/${currentGroupId}/members/`, { // Fetch members of the group
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setMembers(response.data);
        // The response expects an array of members objects { id, firstName, lastName, email, role }
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
      setMembers(members.filter(member => member.id !== id)); // Remove the member from the state
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
      setMembers(members.map(member => member.id === id ? { ...member, role: 'admin' } : member)); // Update the user's role in the state
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
                <button onClick={() => removeMember(member.id, member.email)}>Remove</button>
                {member.role === 'user' && <button onClick={() => promoteMember(member.id, member.email)}>Promote</button>}
            </li>
        ))}
        </ul>
    </div>
  );
};

export default ManageMembers;
