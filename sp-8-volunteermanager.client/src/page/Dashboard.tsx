import React, { useEffect, useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import GroupMenu from '../component/GroupMenu';

// Placeholder components for the dashboard tabs
// TODO: Make components for these services
const SubmitShifts = () => <div>Submit Shifts</div>;
const ManageMembership = () => <div>Manage Membership</div>;
const Submissions = () => <div>Submissions</div>;
const Reports = () => <div>Reports</div>;
const ManageMembers = () => <div>Manage Members</div>;
const Invite = () => <div>Invite</div>;

interface Group {
  id: string;
  name: string;
}

type Tab = {
  name: string;
  link: string;
};

interface RoleResponse {
  role: string;
}

export const Dashboard: React.FC = () => {
  const [role, setRole] = useState<string>(''); // State for the user's role in the selected group
  const [tabs, setTabs] = useState<Tab[]>([]); // State of the selected tab
  const [groups, setGroups] = useState<Group[]>([]); // State of the user's groups
  const [groupID, setGroupID] = useState<string>('loading');

  // IMPORTANT: Each service for a group is accessible by the tab buttons

  useEffect(() => {
    // Fetch the all groups associated with the user from user_groups table
    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://10.69.40.5:8000/api/user/groups'); // Returns all entries associated with the user from the user_group table
        const fetchedGroups = Array.isArray(response.data) ? response.data : [];
        setGroups(fetchedGroups);

        if (groupID === 'loading' && fetchedGroups.length > 0) {
          setGroupID(fetchedGroups[0].id); // Automatically select the first group if none is selected
        }
      } catch (error) { // Error handling
        console.error("Failed to fetch groups or role", error);
      }
    };

    fetchGroups();
  }, [setGroupID]);

  // Update the user's role
  useEffect(() => {
    if (groupID !== 'loading') { // If the groupID has been fetched
      const fetchRole = async () => { // Use the groupID to fetch the user's role
        try {
          const response = await axios.get<RoleResponse>(`http://10.69.40.5:8000/api/user/group/${groupID}/role`); // API call to return the role from user_groups table
          setRole(response.data.role); // Update the role state variable based off the API response
          adjustTabsForRole(response.data.role); // Update the tabs based off role status
        } catch (error) { // Error handling
          console.error("Failed to fetch user role", error);
        }
      };

      fetchRole();
    }
  }, [groupID]);
 
  const adjustTabsForRole = (role: string) => {
    // Tabs for non-admins
    const baseTabs = [{ name: 'Submit shift(s)', link: 'submit-shifts' }, { name: 'Manage membership', link: 'manage-membership' }];
    if (role === 'admin') {
      // Tabs for admins
      const adminTabs = [...baseTabs, { name: 'Submissions', link: 'submissions' }, { name: 'Reports', link: 'reports' }, { name: 'Manage members', link: 'manage-members' }, { name: 'Invite', link: 'invite' }];
      setTabs(adminTabs); // Set tab state for admin status
    } else {
      setTabs(baseTabs); // Set tab state for non-admin
    }
  };

  // Render a loading indicator if groupID is still being fetched
  if (groupID === 'loading') {
    return <div>Loading information...</div>;
  }

  return (
    <div style={{ display: 'flex' }}>
      <GroupMenu groups={groups} onSelectGroup={setGroupID} />
      <div>
        <nav>
          <ul>
            {/* List tabs from state */}
            {tabs.map((tab, index) => ( 
              <li key={index}>
                <Link to={tab.link}>{tab.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <Routes>
          {/* Assign each tab to a component */}
          <Route path="submit-shifts" element={<SubmitShifts />} />
          <Route path="manage-membership" element={<ManageMembership />} />
          {/* Ensure admin-only routes are protected */}
          {role === 'admin' && (
            <>
              <Route path="submissions" element={<Submissions />} />
              <Route path="reports" element={<Reports />} />
              <Route path="manage-members" element={<ManageMembers />} />
              <Route path="invite" element={<Invite />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;