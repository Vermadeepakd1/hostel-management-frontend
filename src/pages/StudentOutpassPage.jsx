// src/pages/StudentOutpassPage.jsx

import React, { useState, useEffect } from 'react';
import { submitOutpassRequest, getStudentOutpasses } from '../api/apiService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function StudentOutpassPage() {
  const [reason, setReason] = useState('');
  const [departureTime, setDepartureTime] = useState(new Date());
  const [returnTime, setReturnTime] = useState(new Date());
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const data = await getStudentOutpasses();
      setHistory(data);
    } catch (error) {
      console.error("Failed to fetch out pass history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const outpassData = {
      reason,
      departure_time: departureTime.toISOString(),
      expected_return_time: returnTime.toISOString(),
    };
    try {
      await submitOutpassRequest(outpassData);
      // Clear form and refresh history
      setReason('');
      fetchHistory();
    } catch (error) {
      console.error("Failed to submit out pass request:", error);
    }
  };
  
  const StatusBadge = ({ status }) => {
    const statusClasses = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClasses[status]}`}>{status}</span>;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Request Form */}
      <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-2xl font-bold mb-4">Request an Out Pass</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Reason</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} rows="4" className="w-full p-2 border rounded mt-1" required></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium">Departure Time</label>
            <DatePicker 
              selected={departureTime} 
              onChange={date => setDepartureTime(date)} 
              showTimeSelect 
              // CORRECTED FORMAT
              dateFormat="dd/MM/yyyy, h:mm aa" 
              className="w-full p-2 border rounded mt-1" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Expected Return Time</label>
            <DatePicker 
              selected={returnTime} 
              onChange={date => setReturnTime(date)} 
              showTimeSelect 
              // CORRECTED FORMAT
              dateFormat="dd/MM/yyyy, h:mm aa" 
              className="w-full p-2 border rounded mt-1" 
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">Submit Request</button>
        </form>
      </div>

      {/* History View */}
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-2xl font-bold mb-4">Your Out Pass History</h2>
        <ul className="space-y-4">
          {isLoading ? <p>Loading history...</p> : history.map(pass => (
            <li key={pass.id} className="p-4 border rounded-md flex justify-between items-center">
              <div>
                <p className="font-semibold">{pass.reason}</p>
                <p className="text-sm text-gray-500">Departure: {new Date(pass.departure_time).toLocaleString('en-IN')}</p>
                <p className="text-sm text-gray-500">Return: {new Date(pass.expected_return_time).toLocaleString('en-IN')}</p>
              </div>
              <StatusBadge status={pass.status} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default StudentOutpassPage;