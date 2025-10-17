// src/pages/StudentAnnouncementsPage.jsx

import React, { useState, useEffect } from 'react';
import { getAnnouncements } from '../api/apiService';

function StudentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements();
        setAnnouncements(data);
      } catch (err) {
        setError('Failed to fetch announcements.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  if (isLoading) return <p>Loading announcements...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Notice Board</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4">
        {announcements.map(ann => (
          <div key={ann.id} className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="font-bold text-xl text-blue-600">{ann.title}</h2>
            <p className="text-gray-700 mt-2">{ann.content}</p>
            <p className="text-sm text-gray-400 mt-4">Posted: {new Date(ann.created_at).toLocaleString()}</p>
          </div>
        ))}
        {announcements.length === 0 && !error && (
            <p className="text-gray-500">There are no announcements at this time.</p>
        )}
      </div>
    </div>
  );
}

export default StudentAnnouncementsPage;