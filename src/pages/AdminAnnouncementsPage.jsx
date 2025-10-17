// src/pages/AdminAnnouncementsPage.jsx

import React, { useState, useEffect } from 'react';
import { getAnnouncements, createAnnouncement } from '../api/apiService';

function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      setError('Failed to fetch announcements.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnnouncement(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAnnouncement(newAnnouncement.title, newAnnouncement.content);
      setNewAnnouncement({ title: '', content: '' }); // Clear form
      fetchAnnouncements(); // Refresh the list
    } catch (err) {
      console.error("Failed to create announcement:", err);
    }
  };

  if (isLoading) return <p>Loading announcements...</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Create Announcement Form */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Announcement</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="title" value={newAnnouncement.title} onChange={handleInputChange} placeholder="Title" className="w-full p-2 border rounded" required />
            <textarea name="content" value={newAnnouncement.content} onChange={handleInputChange} placeholder="Content" className="w-full p-2 border rounded" rows="5" required></textarea>
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">Post Announcement</button>
          </form>
        </div>
      </div>

      {/* Announcements List */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Posted Announcements</h2>
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-4">
          {announcements.map(ann => (
            <div key={ann.id} className="bg-white p-4 rounded-lg shadow-md border">
              <h3 className="font-bold text-lg">{ann.title}</h3>
              <p className="text-gray-600 mt-1">{ann.content}</p>
              <p className="text-xs text-gray-400 mt-2">Posted on: {new Date(ann.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminAnnouncementsPage;
