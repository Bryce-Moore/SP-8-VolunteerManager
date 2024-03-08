import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './page/Home';
import Dashboard from './page/Dashboard';
import RequireAuth from './service/RequireAuth';
import GroupMenu from './component/GroupMenu';
import axios from 'axios';

function App() {
  // State for selected/current group in the dashboard
  const [selectedGroup, setSelectedGroup] = useState<string>('loading');

  // Fetch the first group for initial state
  const fetchDefaultGroup = async () => {
    try {
      const response = await axios.get('http://10.69.40.5:8000/api/user/group/1'); // Returns groupID of first user_group entry
      console.log(response.data); 
      setSelectedGroup(response.data); // Updates the current organization state
    } catch (error) { // Error handling
      console.error('Error fetching default group:', error);
      throw error;
    }
  };

  useEffect(() => { // Asynchronously update the state
    fetchDefaultGroup();
  }, []);

  const handleSelectGroup = (groupID: string) => { // User selects organization for dashboard viewing
    setSelectedGroup(groupID);
  };

  return (
    <BrowserRouter> 
      <div style={{ display: 'flex' }}> {/* Display GroupMenu and Dashboard inline */}
        <div> {/* Give GroupMenu left 1/5 of screen */}
          <GroupMenu onSelectGroup={handleSelectGroup} /> {/* Pass select-group handler */}
        </div>
        <div> 
          <Routes>
            <Route path="/" element={<Home />} /> {/* Default route. Home screen */}
            <Route path="/dashboard" element={ 
              <RequireAuth> {/* Ensures there's an auth token in session storage. Redirects to Home if not*/}
                <Dashboard groupID={selectedGroup} /> {/* Pass the selectedGroupID as prop */}
              </RequireAuth>
            } />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;