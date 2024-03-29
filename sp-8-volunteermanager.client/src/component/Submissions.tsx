// src/components/Submissions.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import common from '../styles/Common.module.css';

interface Shift {
  shift_id: string;
  date: string;
  start_time: string;
  end_time: string;
  total_time: string;
  status: 'Approved' | 'Denied' | 'Pending';
  account_id: string;
}

interface Props {
  currentGroupId: string;
}

const Submissions: React.FC<Props> = ({ currentGroupId }) => {
  const [allShifts, setAllShifts] = useState<Shift[]>([]);
  const [displayedShifts, setDisplayedShifts] = useState<Shift[]>([]);
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const auth_token = sessionStorage.getItem('auth_token');

  useEffect(() => {
    fetchShiftSubmissions();
  }, [currentGroupId]); // Fetch once when the component mounts or currentGroupId changes

  const fetchShiftSubmissions = async () => {
    try {
      const response = await axios.get(`http://10.69.40.5:8000/api/shifts/submissions`, {
        params: {
          group_id: currentGroupId,
          auth_token
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setAllShifts(response.data);
      setDisplayedShifts(response.data); // Initially, display all shifts
    } catch (error) {
      console.error("Failed to fetch shift submissions", error);
    }
  };

  const filterShifts = () => {
    let filteredShifts = allShifts;

    if (filterDateStart) {
      filteredShifts = filteredShifts.filter(shift => shift.date >= filterDateStart);
    }

    if (filterDateEnd) {
      filteredShifts = filteredShifts.filter(shift => shift.date <= filterDateEnd);
    }

    if (nameFilter) {
      filteredShifts = filteredShifts.filter(shift => shift.account_id.toLowerCase().includes(nameFilter.toLowerCase()));
    }

    setDisplayedShifts(filteredShifts);
  };

  useEffect(() => {
    filterShifts(); // Re-filter whenever filter criteria change
  }, [filterDateStart, filterDateEnd, nameFilter, allShifts]);

  const updateShiftStatus = async (shift_id: string, newStatus: 'Approved' | 'Denied') => {
    try {
      await axios.post(`http://10.69.40.5:8000/api/shifts/update-status`, {
        shift_id,
        status: newStatus,
        auth_token,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      fetchShiftSubmissions(); // Refresh the list after updating
    } catch (error) {
      console.error("Failed to update shift status", error);
    }
  };

  return (
    <div className={common.container}>
      <h2>Shift Submissions</h2>
      <div >
        <input
          type="date"
          value={filterDateStart}
          className={common.input}
          onChange={(e) => setFilterDateStart(e.target.value)}
          placeholder="Start Date"
        />
        <input
          type="date"
          value={filterDateEnd}
          className={common.input}
          onChange={(e) => setFilterDateEnd(e.target.value)}
          placeholder="End Date"
        />
        <input
          type="text"
          value={nameFilter}
          className={common.input}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder="Submitter Name"
        />
        <button className={common.whiteButton} onClick={fetchShiftSubmissions}>Filter</button>
      </div>
      <ul>
        {displayedShifts.map(shift => (
          <li key={shift.shift_id}>
            {/* Ideally we switch change account_id to email for this display */}
            <div>{shift.date} - {shift.start_time} to {shift.end_time} ({shift.total_time}) by {shift.account_id}</div>
            <div>Status: {shift.status}</div>
            {shift.status === 'Pending' && (
              <>
                <button onClick={() => updateShiftStatus(shift.shift_id, 'Approved')}>Approve</button>
                <button onClick={() => updateShiftStatus(shift.shift_id, 'Denied')}>Deny</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Submissions;