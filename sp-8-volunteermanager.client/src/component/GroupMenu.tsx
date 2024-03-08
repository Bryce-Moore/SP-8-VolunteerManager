import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Group {
  id: string;
  name: string;
}

interface GroupMenuProps {
  onSelectGroup: (groupID: string) => void;
}

const GroupMenu: React.FC<GroupMenuProps> = ({ onSelectGroup }) => {
  const [groups, setGroups] = useState<Group[]>([]); // State updating the list of groups

  useEffect(() => { // useEffect because the state relies on async data
    const fetchGroups = async () => {
      try {
        // Fetch the all group entries associated with the user from user_groups table
        const response = await axios.get(`http://10.69.40.5:8000/api/user/groups`);
        const groupsData = Array.isArray(response.data) ? response.data : [];
        setGroups(groupsData);
      } catch (error) { // Error handling
        console.error("Failed to fetch groups", error);
      }
    };

    fetchGroups(); // Call the async function
  }, []);

  return (
    <div>
      {/* Map each group to a button */}
      {/* Selecting group updates state in App.tsx and Dashboard.tsx via prop function */}
      {groups.map(group => ( 
        <div key={group.id} onClick={() => onSelectGroup(group.id)} style={{ cursor: 'pointer', padding: '10px', margin: '5px', border: '1px solid #ccc', borderRadius: '5px' }}>
          {group.name}
        </div>
      ))}
    </div>
  );
};

export default GroupMenu;