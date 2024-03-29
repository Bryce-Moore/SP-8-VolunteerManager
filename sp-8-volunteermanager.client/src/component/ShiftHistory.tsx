// src/components/ShiftHistory.tsx
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

const ShiftHistory: React.FC<Props> = ({ currentGroupId }) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const auth_token = sessionStorage.getItem('auth_token');
  const account_id = sessionStorage.getItem('account_id');

  useEffect(() => {
    const fetchShiftHistory = async () => {
      try {
        const response = await axios.get(`http://10.69.40.5:8000/api/shifts/submissions`, {
          params: {
            group_id: currentGroupId,
            auth_token,
            account_id
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setShifts(response.data);
      } catch (error) {
        console.error("Failed to fetch shift history", error);
      }
    };

    fetchShiftHistory();
  }, [currentGroupId]);

  const cancelShift = async (shiftId: string) => {
    try {
      await axios.delete(`http://10.69.40.5:8000/api/shifts/cancel/${shiftId}?auth_token=${auth_token}&account_id=${account_id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // Remove the cancelled shift from the list
      setShifts(shifts.filter(shift => shift.shift_id !== shiftId));
      alert('Shift cancelled successfully.');
    } catch (error) {
      console.error("Failed to cancel shift", error);
      // Handle error appropriately in production code
    }
  };

  return (
    <div className={common.container}>
      <h2>Shift History</h2>
      <ul>
        {shifts.map(shift => (
          <li key={shift.shift_id}>
            <div>Date: {shift.date}</div>
            <div>Start Time: {shift.start_time}</div>
            <div>End Time: {shift.end_time}</div>
            <div>Total Time: {shift.total_time}</div>
            <div>Status: {shift.status}{shift.status === 'Pending' && <button onClick={() => cancelShift(shift.shift_id)}>Cancel Shift</button>}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShiftHistory;