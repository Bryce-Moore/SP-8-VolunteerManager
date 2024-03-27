// Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import GroupMenu from '../component/GroupMenu';
import CreateGroup from '../component/CreateGroup';
import JoinGroup from '../component/JoinGroup';
import Invite from '../component/Invite';
import ManageMembership from '../component/ManageMembership';
import ManageMembers from '../component/ManageMembers';
import SubmitShifts from '../component/SubmitShifts';
import ShiftHistory from '../component/ShiftHistory';
import Submissions from '../component/Submissions';

// Placeholder components for the dashboard tabs
// TODO: Make components for these services
const Reports = () => <div>Reports</div>;

interface Group {
  group_id: string;
  name: string;
  role: string;
}

type Tab = {
  name: string;
  link: string;
};

export const Dashboard: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([]); // State of the selected tab
  const [groups, setGroups] = useState<Group[]>([]); // State of the user's groups
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null); // State of the currently selected group
  const auth_token = sessionStorage.getItem('auth_token');
  const account_id = sessionStorage.getItem('account_id');
  const location = useLocation();
  const navigate = useNavigate();
  
  // Variable for monitoring state of create-group
  const isCreatingGroup = location.pathname.endsWith('create-group');

  // IMPORTANT: Each service for a group is accessible by the tab buttons

  useEffect(() => {
     // Fetch the all groups associated with the user
    const fetchGroups = async () => {
      if (!currentGroup) {
        try {
          // Returns an array of all the groupIDs, group names, and roles associated with the user
          const response = await axios.get(`http://10.69.40.5:8000/api/user/groups`, {
            params: {
              account_id: account_id,
              auth_token: auth_token
            },
            headers: { 'Content-Type': 'application/json' }
          });
          const fetchedGroups: Group[] = Array.isArray(response.data) ? response.data : [];
          setGroups(fetchedGroups);
          
          console.log("Fetched groups:", fetchedGroups);

          // Set the first group by default or null if there are no groups
          setCurrentGroup(fetchedGroups.length > 0 ? fetchedGroups[0] : null);
        } catch (error) { // Error handling
          console.error("Failed to fetch groups", error);
          setCurrentGroup(null);
        }
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    if (!currentGroup && !isCreatingGroup) {
      // Show only the 'Join Group' tab when there's no current group selected or being created
      setTabs([{ name: 'Join Group', link: 'join-group' }]);
    } else if (currentGroup) {
      // Adjust tabs for role if there's a current group
      adjustTabsForRole(currentGroup.role);
    } else {
      // Clear tabs or set a different state if needed when creating a group
      setTabs([]);
    }
  }, [currentGroup, isCreatingGroup]);

  const adjustTabsForRole = (role: string) => {
    // Tabs for non-admins
    const baseTabs = [{ name: 'Submit shift(s)', link: 'submit-shifts' }, { name: 'My Shift History', link: 'shift-history' }, { name: 'Manage membership', link: 'manage-membership' }];
    if (role === 'Admin') {
      // Tabs for admins
      const adminTabs = [...baseTabs, { name: 'Submissions', link: 'submissions' }, { name: 'Reports', link: 'reports' }, { name: 'Manage members', link: 'manage-members' }, { name: 'Invite', link: 'invite' }];
      setTabs(adminTabs);
    } else {
      setTabs(baseTabs);
    }
  };

  const handleGroupLeft = () => {
    setCurrentGroup(null);
    navigate('/join-group');
  };

  console.log("Current Group ID before passing to Invite:", currentGroup?.group_id);

  return (
    <div style={{ display: 'flex' }}>
      <GroupMenu 
        currentGroup={currentGroup} 
        groups={groups} 
        onSelectGroup={(group_id, name, role) => setCurrentGroup({ group_id, name, role })} 
        onCreateGroup={() => navigate('create-group')} // Adjusted to navigate to create group view
        onJoinGroup={() => navigate('join-group')} // Adjusted for clarity, though it may be redundant based on your routing setup
      />
      <nav>
      <ul>
        {tabs.map((tab, index) => (
          <li key={index}>
            <Link to={tab.link}>{tab.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
      <div>
        <Routes>
          {/* Assign each tab to a component */} 
          {currentGroup != null && (
            <>
              <Route path="submit-shifts" element={<SubmitShifts currentGroupId={currentGroup.group_id} />} />
              <Route path="shift-history" element={<ShiftHistory currentGroupId={currentGroup.group_id} />} />
              <Route path="manage-membership" element={<ManageMembership currentGroupId={currentGroup.group_id} onGroupLeft={handleGroupLeft} />} />
            </>
          )}
          {/* Ensure admin-only routes are protected */}
          {currentGroup != null && currentGroup.role === 'Admin' && (
            <>
              <Route path="submissions" element={<Submissions currentGroupId={currentGroup.group_id}/>} />
              <Route path="reports" element={<Reports />} />
              <Route path="manage-members" element={<ManageMembers currentGroupId={currentGroup.group_id} />} />
              <Route path="invite" element={<Invite currentGroupId={currentGroup.group_id} />} />
            </>
          )}
          <Route path="create-group" element={<CreateGroup />} />
          <Route path="join-group" element={<JoinGroup />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;