// src/pages/AdminDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import Widget from '../components/Widget';
import { getStudents, getRooms } from '../api/apiService'; 
import { FaUsers, FaRegListAlt, FaDoorOpen, FaMoneyBillWave } from 'react-icons/fa';

function AdminDashboardPage() {
  const [studentCount, setStudentCount] = useState(0);
  const [roomData, setRoomData] = useState({ occupied: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [students, rooms] = await Promise.all([
          getStudents(),
          getRooms()
        ]);
        setStudentCount(students.length);
        const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
        const currentOccupancy = rooms.reduce((sum, room) => sum + room.current_occupancy, 0);
        setRoomData({ occupied: currentOccupancy, total: totalCapacity });
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // Note: We no longer need the main div container or the <Header /> here.
  // We just return the content that goes inside the AdminLayout's <main> tag.
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Widget title="Total Students" icon={<FaUsers size={24} />} color="blue">
        <p className="text-4xl font-bold text-gray-800">{studentCount}</p>
        <p className="text-sm text-gray-500 mt-1">students currently enrolled</p>
      </Widget>
      <Widget title="Room Occupancy" icon={<FaDoorOpen size={24} />} color="yellow">
        <p className="text-4xl font-bold text-gray-800">
          {roomData.total > 0 ? Math.round((roomData.occupied / roomData.total) * 100) : 0}%
        </p>
        <p className="text-sm text-gray-500 mt-1">{roomData.occupied} out of {roomData.total} beds filled</p>
      </Widget>
      <Widget title="Fees Due" icon={<FaMoneyBillWave size={24} />} color="red">
        <p className="text-4xl font-bold text-gray-800">₹10,40,000</p>
        <p className="text-sm text-gray-500 mt-1">from 12 students</p>
      </Widget>
      <Widget title="Recent Complaints" icon={<FaRegListAlt size={24} />} color="green">
         <p className="text-gray-600">Feature coming soon.</p>
      </Widget>
    </div>
  );
}

export default AdminDashboardPage;