// src/pages/StudentAnnouncementsPage.jsx

import React, { useState, useEffect } from 'react';
import { getAnnouncements } from '../api/apiService';
import { FaExternalLinkAlt, FaCreditCard } from 'react-icons/fa';

// UPDATED: More robust parsing for link, start date, end date
const parseFeeDetails = (content) => {
    // Case-insensitive, allows for spaces around colon
    const linkMatch = content.match(/Link\s*:\s*(https?:\/\/\S+)/i);
    const startMatch = content.match(/Start Date\s*:\s*(\d{1,2}\/\d{1,2}\/\d{4})/i);
    const endMatch = content.match(/End Date\s*:\s*(\d{1,2}\/\d{1,2}\/\d{4})/i);

    // Clean content by removing tags and extracted details
    const cleanContent = content.replace(/#FEES_PIN|Link\s*:\s*\S+|Start Date\s*:\s*\S+|End Date\s*:\s*\S+/gi, '').trim();

    return {
        link: linkMatch ? linkMatch[1] : null,
        startDate: startMatch ? startMatch[1] : null,
        endDate: endMatch ? endMatch[1] : null,
        cleanContent: cleanContent
    };
};


function StudentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ... fetchAnnouncements logic remains the same ...
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        const data = await getAnnouncements();
        setAnnouncements(data);
      } catch (err) {
        setError('Failed to fetch announcements.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  if (isLoading) return <p className="text-center p-10">Loading announcements...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Notice Board</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded border border-red-300 mb-4">{error}</p>}
      <div className="space-y-4">
        {announcements.length === 0 && !error && !isLoading && (
            <p className="text-gray-500 text-center py-6">There are no announcements at this time.</p>
        )}
        {announcements.map(ann => {
          // Check if this is a pinned fee announcement
          const isFeeNotice = ann.title.toLowerCase().includes('#fees_pin') ||
                              ann.content.toLowerCase().includes('#fees_pin') ||
                              ann.title.toLowerCase().includes('fee payment');

          if (isFeeNotice) {
            const details = parseFeeDetails(ann.content);
            const title = ann.title.replace(/#FEES_PIN/i, '').trim();

            return (
              // Special highlighted card for fee notices
              <div key={ann.id} className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200 ring-2 ring-blue-500 ring-offset-2">
                <h2 className="font-bold text-xl text-blue-700 flex items-center gap-2">
                    <FaCreditCard /> {title || "Fee Payment Notice"}
                </h2>
                {/* Display clean content */}
                <p className="text-gray-700 mt-2">{details.cleanContent || ann.content.replace(/#FEES_PIN/i, '').trim()}</p>
                {/* Display extracted dates */}
                <div className="text-sm text-gray-600 mt-3 space-y-1">
                    {details.startDate && <p><strong>Start Date:</strong> {details.startDate}</p>}
                    {details.endDate && <p><strong>End Date:</strong> {details.endDate}</p>}
                </div>
                {/* Display Pay Now button if link exists */}
                {details.link && (
                    <div className="mt-4 border-t pt-4 flex justify-end">
                        <a href={details.link} target="_blank" rel="noopener noreferrer"
                           className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-150 flex items-center gap-2 transform hover:scale-105">
                            Pay Now
                            <FaExternalLinkAlt size={12} />
                        </a>
                    </div>
                )}
                 <p className="text-xs text-gray-400 mt-4 text-right">Posted: {new Date(ann.created_at).toLocaleString('en-IN')}</p>
              </div>
            );
          } else {
            // Regular announcement card
            return (
              <div key={ann.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="font-bold text-xl text-gray-800">{ann.title}</h2>
                <p className="text-gray-700 mt-2 whitespace-pre-wrap">{ann.content}</p> {/* Use whitespace-pre-wrap to respect line breaks */}
                <p className="text-sm text-gray-400 mt-4">Posted: {new Date(ann.created_at).toLocaleString('en-IN')}</p>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

export default StudentAnnouncementsPage;