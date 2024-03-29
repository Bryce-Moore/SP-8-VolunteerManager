// src/components/SubmitShifts.tsx
import React, { useState } from 'react';
import axios from 'axios';
import common from '../styles/Common.module.css';

interface Props {
  currentGroupId: string; 
}

const SubmitShifts: React.FC<Props> = ({ currentGroupId }) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const auth_token = sessionStorage.getItem('auth_token');
  const account_id = sessionStorage.getItem('account_id');

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://10.69.40.5:8000/api/shifts/submit', {
        date,
        start_time: startTime,
        end_time: endTime,
        group_id: currentGroupId,
        auth_token,
        account_id
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // Handle response
      console.log(response.data); // For debugging
      setMessage('Shift submitted successfully!');
    } catch (error) {
      console.error("Error submitting shift", error);
      setMessage('Failed to submit shift. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={common.container}>
      <h2>Submit Shift</h2>
      <form className={common.centerForm} onSubmit={handleSubmit}>
        <label className={common.inputRow}>
          Date:
          <input className={common.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <label className={common.inputRow}>
          Time Started (e.g., 8:00 AM):
          <input className={common.input} type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </label>
        <label className={common.inputRow}>
          Time Finished (e.g., 5:00 PM):
          <input className={common.input} type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </label>
        <button className={common.button} type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Shift'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SubmitShifts;
