// src/pages/StudentDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { getStudentProfile, getAnnouncements, getStudentComplaints, getStudentFees } from '../api/apiService';
import { Link } from 'react-router-dom';
import { FaBell, FaExclamationCircle, FaFileInvoiceDollar } from 'react-icons/fa';

// A small helper component for styling the complaint status
const StatusBadge = ({ status }) => {
    const statusClasses = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Resolved': 'bg-green-100 text-green-800',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClasses[status]}`}>{status}</span>;
};

function StudentDashboardPage() {
  const [profile, setProfile] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [fees, setFees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all data in parallel for better performance
        const [profileData, announcementsData, complaintsData, feesData] = await Promise.all([
          getStudentProfile(),
          getAnnouncements(),
          getStudentComplaints(),
          getStudentFees()
        ]);

        setProfile(profileData);
        setAnnouncements(announcementsData);
        setComplaints(complaintsData);
        setFees(feesData);
      } catch (err) {
        setError('Failed to load your dashboard. Please try logging in again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (isLoading) return <p>Loading your dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // Get the latest item from each list
  const latestAnnouncement = announcements[0];
  const latestComplaint = complaints[0];
  const latestFee = fees[0];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">
        Welcome, {profile?.name}!
      </h1>
      <p className="mt-2 text-gray-600">
        Here's a quick summary of your recent activity.
      </p>

      {/* New Widget Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Latest Announcement Widget */}
        <Link to="/student/announcements" className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow block">
          <div className="flex items-center text-blue-600 mb-3">
            <FaBell className="mr-2" />
            <h2 className="font-bold text-xl">Latest Announcement</h2>
          </div>
          {latestAnnouncement ? (
            <div>
              <p className="font-semibold text-gray-800">{latestAnnouncement.title}</p>
              <p className="text-gray-500 mt-1 truncate">{latestAnnouncement.content}</p>
            </div>
          ) : (
            <p className="text-gray-500 mt-2">No new announcements.</p>
          )}
        </Link>

        {/* Latest Complaint Widget */}
        <Link to="/student/complaints" className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow block">
          <div className="flex items-center text-blue-600 mb-3">
            <FaExclamationCircle className="mr-2" />
            <h2 className="font-bold text-xl">Latest Complaint</h2>
          </div>
          {latestComplaint ? (
            <div className="flex justify-between items-start">
              <p className="text-gray-700 truncate pr-4">{latestComplaint.description}</p>
              <StatusBadge status={latestComplaint.status} />
            </div>
          ) : (
            <p className="text-gray-500 mt-2">You have no recent complaints.</p>
          )}
        </Link>
        
        {/* Latest Fee Payment Widget */}
        <Link to="/student/fees" className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow block">
          <div className="flex items-center text-blue-600 mb-3">
            <FaFileInvoiceDollar className="mr-2" />
            <h2 className="font-bold text-xl">Last Fee Payment</h2>
          </div>
          {latestFee ? (
            <div>
              <p className="font-semibold text-2xl text-gray-800">₹{latestFee.amount_paid}</p>
              <p className="text-gray-500 mt-1">Paid on: {new Date(latestFee.payment_date).toLocaleDateString()}</p>
            </div>
          ) : (
            <p className="text-gray-500 mt-2">No recent payment history.</p>
          )}
        </Link>

      </div>
    </div>
  );
}

export default StudentDashboardPage;