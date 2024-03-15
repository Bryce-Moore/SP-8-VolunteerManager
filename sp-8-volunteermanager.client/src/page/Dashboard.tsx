// Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import GroupMenu from '../component/GroupMenu';
import CreateGroup from '../component/CreateGroup';

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

  // IMPORTANT: Each service for a group is accessible by the tab buttons

  useEffect(() => {
     // Fetch the all groups associated with the user
    const fetchGroups = async () => {
      try {
        // Returns an array of all the groupIDs, group names, and roles associated with the user
        const response = await axios.get('http://10.69.40.5:8000/api/user/groups/', {
          headers: { 'Content-Type': 'application/json' }
        });
        const fetchedGroups: Group[] = Array.isArray(response.data) ? response.data : [];
        setGroups(fetchedGroups);

        // Set the first group by default or null if there are no groups
        setCurrentGroup(fetchedGroups.length > 0 ? fetchedGroups[0] : null);
      } catch (error) { // Error handling
        console.error("Failed to fetch groups", error);
        setCurrentGroup(null);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    if (currentGroup) {
      adjustTabsForRole(currentGroup.role);
    } else {
      // If there's no current group, show CreateGroup
      setTabs([{ name: 'Create Group', link: 'create-group' }]);
    }
  }, [currentGroup]); // Listen for changes to currentGroup

  const adjustTabsForRole = (role: string) => {
    // Tabs for non-admins
    const baseTabs = [{ name: 'Submit shift(s)', link: 'submit-shifts' }, { name: 'Manage membership', link: 'manage-membership' }];
    if (role === 'admin') {
      // Tabs for admins
      const adminTabs = [...baseTabs, { name: 'Submissions', link: 'submissions' }, { name: 'Reports', link: 'reports' }, { name: 'Manage members', link: 'manage-members' }, { name: 'Invite', link: 'invite' }];
      setTabs(adminTabs);
    } else {
      setTabs(baseTabs);
    }
  };

  if (!currentGroup) {
    // Directly render CreateGroup if no groups are loaded or if user has no groups
    return <CreateGroup />;
  }

  return (
    <div style={{ display: 'flex' }}>
      <GroupMenu currentGroup={currentGroup} groups={groups} onSelectGroup={(id, name, role) => setCurrentGroup({id, name, role})} onCreateGroup={() => setCurrentGroup(null)} />
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
          {currentGroup.role === 'admin' && (
            <>
              <Route path="submissions" element={<Submissions />} />
              <Route path="reports" element={<Reports />} />
              <Route path="manage-members" element={<ManageMembers />} />
              <Route path="invite" element={<Invite />} />
            </>
          )}
          <Route path="create-group" element={<CreateGroup />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;