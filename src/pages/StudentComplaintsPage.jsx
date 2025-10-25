// src/pages/StudentComplaintsPage.jsx

import React, { useState, useEffect } from 'react';
import { getStudentComplaints, submitStudentComplaint } from '../api/apiService';

// Helper component using the original styling
const StatusBadge = ({ status }) => {
    const statusClasses = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Resolved': 'bg-green-100 text-green-800',
    };
    // Use standard gray as fallback
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
};

function StudentComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(''); // Error state for submission

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      setError(null); // Clear previous errors
      const data = await getStudentComplaints();
      setComplaints(data);
    } catch (err) {
      setError('Failed to fetch your complaints. Please log in again.');
      console.error(err); // Log error for debugging
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(''); // Clear previous submission errors
    if (!newComplaint) return;
    try {
      await submitStudentComplaint(newComplaint);
      setNewComplaint(''); // Clear the form
      fetchComplaints(); // Refresh the list of complaints
    } catch (err) {
      console.error('Failed to submit complaint:', err);
      setSubmitError(err.response?.data?.message || 'Failed to submit complaint. Please try again.'); // Show specific error
    }
  };

  if (isLoading && !error) return <p className="text-center p-10">Loading your complaints...</p>;

  return (
    <div>
      {/* Form to submit a new complaint - Original Style */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Submit a New Complaint</h2>
        <form onSubmit={handleSubmit}>
          {submitError && <p className="text-red-600 mb-3">{submitError}</p>}
          <textarea
            value={newComplaint}
            onChange={(e) => setNewComplaint(e.target.value)}
            placeholder="Please describe your issue in detail..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          ></textarea>
          <button type="submit" className="mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Submit Complaint
          </button>
        </form>
      </div>

      {/* List of past complaints - Original Style */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Complaint History</h2>
        {error && <p className="text-red-500">{error}</p>}
        {isLoading && <p>Refreshing history...</p>}
        <ul className="space-y-4">
          {!isLoading && complaints.map((complaint) => (
            <li key={complaint.id} className="p-4 border border-gray-200 rounded-md flex flex-col sm:flex-row justify-between sm:items-center">
              <div className="mb-2 sm:mb-0">
                <p className="text-gray-700">{complaint.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Submitted on: {new Date(complaint.created_at).toLocaleDateString()}
                </p>
              </div>
              <StatusBadge status={complaint.status} />
            </li>
          ))}
          {!isLoading && complaints.length === 0 && !error && (
            <p className="text-gray-500 text-center py-4">You have not submitted any complaints yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default StudentComplaintsPage;