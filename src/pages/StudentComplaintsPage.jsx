// src/pages/StudentComplaintsPage.jsx

import React, { useState, useEffect } from 'react';
import { getStudentComplaints, submitStudentComplaint } from '../api/apiService';

function StudentComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      const data = await getStudentComplaints();
      setComplaints(data);
    } catch (err) {
      setError('Failed to fetch your complaints. Please log in again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComplaint) return;
    try {
      await submitStudentComplaint(newComplaint);
      setNewComplaint(''); // Clear the form
      fetchComplaints(); // Refresh the list of complaints
    } catch (err) {
      console.error('Failed to submit complaint:', err);
      // Optionally, show an error message to the user
    }
  };
  
  const StatusBadge = ({ status }) => {
    const statusClasses = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Resolved': 'bg-green-100 text-green-800',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClasses[status]}`}>{status}</span>;
  };

  if (isLoading) return <p>Loading your complaints...</p>;

  return (
    <div>
      {/* Form to submit a new complaint */}
      <div className="bg-white p-6 rounded-lg shadow-md border mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Submit a New Complaint</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={newComplaint}
            onChange={(e) => setNewComplaint(e.target.value)}
            placeholder="Please describe your issue in detail..."
            className="w-full p-3 border rounded-md"
            rows="4"
            required
          ></textarea>
          <button type="submit" className="mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
            Submit Complaint
          </button>
        </form>
      </div>

      {/* List of past complaints */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Complaint History</h2>
        {error && <p className="text-red-500">{error}</p>}
        <ul className="space-y-4">
          {complaints.map((complaint) => (
            <li key={complaint.id} className="p-4 border rounded-md flex justify-between items-center">
              <div>
                <p className="text-gray-700">{complaint.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Submitted on: {new Date(complaint.created_at).toLocaleDateString()}
                </p>
              </div>
              <StatusBadge status={complaint.status} />
            </li>
          ))}
          {complaints.length === 0 && !error && (
            <p className="text-gray-500">You have not submitted any complaints yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default StudentComplaintsPage;