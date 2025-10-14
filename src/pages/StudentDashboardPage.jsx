// src/pages/StudentDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { getStudentProfile } from '../api/apiService';
import { Link } from 'react-router-dom';

function StudentDashboardPage() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getStudentProfile();
        setProfile(data);
      } catch (err) {
        setError('Failed to load your profile. Please try logging in again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading) return <p>Loading your dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">
        Welcome, {profile?.name}!
      </h1>
      <p className="mt-2 text-gray-600">
        Here you can manage your hostel details, view fees, and submit complaints.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/student/fees" className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
          <h2 className="font-bold text-xl text-blue-600">View Fee History</h2>
          <p className="text-gray-500 mt-2">Check your payment status and past transactions.</p>
        </Link>
        <Link to="/student/complaints" className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
          <h2 className="font-bold text-xl text-blue-600">Manage Complaints</h2>
          <p className="text-gray-500 mt-2">Submit a new complaint or view the status of existing ones.</p>
        </Link>
      </div>
    </div>
  );
}

export default StudentDashboardPage;