// src/pages/AdminAnnouncementsPage.jsx

import React, { useState, useEffect } from 'react';
import { getAnnouncements, createAnnouncement } from '../api/apiService';
// 1. Import motion and the new skeleton loader
import { motion, AnimatePresence } from 'framer-motion';
import AnnouncementSkeleton from '../components/AnnouncementSkeleton';

function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false); // For submit button
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
    setIsPosting(true);
    try {
      await createAnnouncement(newAnnouncement.title, newAnnouncement.content);
      setNewAnnouncement({ title: '', content: '' }); // Clear form
      fetchAnnouncements(); // Refresh the list
    } catch (err) {
      console.error("Failed to create announcement:", err);
      // You could set an error state here to show in the UI
    } finally {
      setIsPosting(false);
    }
  };

  // 2. Sort announcements to show newest first
  const sortedAnnouncements = announcements.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  // 3. Use the Skeleton Loader
  if (isLoading) return <AnnouncementSkeleton />;

  return (
    // 4. Page fade-in animation
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Create Announcement Form */}
      <motion.div 
        className="lg:col-span-1"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-white p-6 rounded-lg shadow-md border sticky top-24">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Announcement</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                name="title"
                value={newAnnouncement.title}
                onChange={handleInputChange}
                placeholder="Subject of the announcement"
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                required
                spellCheck="true" // 5. Added spell checker
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                name="content"
                value={newAnnouncement.content}
                onChange={handleInputChange}
                placeholder="Write the full announcement here..."
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                rows="5"
                required
                spellCheck="true" // 5. Added spell checker
              />
            </div>
            {/* 6. Animated submit button */}
            <motion.button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-lg font-medium shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isPosting}
            >
              {isPosting ? 'Posting...' : 'Post Announcement'}
            </motion.button>
          </form>
        </div>
      </motion.div>

      {/* Announcements List */}
      <motion.div 
        className="lg:col-span-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Posted Announcements</h2>
        {error && <p className="text-red-500">{error}</p>}
        
        {/* 7. Animated list */}
        <div className="space-y-4">
          <AnimatePresence>
            {sortedAnnouncements.length > 0 ? (
              sortedAnnouncements.map(ann => (
                <motion.div
                  key={ann.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-5 rounded-lg shadow-md border border-gray-200"
                >
                  <h3 className="font-bold text-lg text-gray-900">{ann.title}</h3>
                  <p className="text-gray-600 mt-1 whitespace-pre-wrap">{ann.content}</p>
                  <p className="text-xs text-gray-400 mt-3 pt-2 border-t border-gray-100">
                    {/* 8. Improved date formatting */}
                    Posted on: {new Date(ann.created_at).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </p>
                </motion.div>
              ))
            ) : (
              !error && <p className="text-gray-500">No announcements posted yet.</p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AdminAnnouncementsPage;