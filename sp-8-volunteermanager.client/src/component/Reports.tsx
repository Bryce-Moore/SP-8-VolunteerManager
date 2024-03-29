// src/components/Reports.tsx
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Reports.css';
import common from '../styles/Common.module.css';

const Reports: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [emails, setEmails] = useState('');
  const [reportUrl, setReportUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth_token = sessionStorage.getItem('auth_token');

  const generateReport = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://10.69.40.5:8000/api/reports/generate`, {
        params: {
          start_date: startDate,
          end_date: endDate,
          email: emails.split(',').map(email => email.trim()), // Assuming the API can handle an array of emails
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth_token}`,
        },
        responseType: 'blob', // Important for handling binary data
      });
      
      // Create a URL for the downloaded file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setReportUrl(url);
    } catch (error) {
      console.error("Failed to generate report", error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={common.container}>
      <h2>Generate Report</h2>
      <div>
        <label className={common.inputRow}>
          Start Date:
          <input className={common.input} type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </label>
        <label className={common.inputRow}>
          End Date:
          <input  className={common.input} type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </label>
        <label className={common.inputRow}>
          Emails (comma-separated):
          <input className={common.input}  type="text" value={emails} onChange={e => setEmails(e.target.value)} placeholder="example1@test.com, example2@test.com" />
        </label>
      </div>
      <button className={common.button} onClick={generateReport} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Report'}
      </button>
      {reportUrl && (
        <div>
          <a href={reportUrl} download="report.csv">Download Report</a>
        </div>
      )}
    </div>
  );
};

export default Reports;