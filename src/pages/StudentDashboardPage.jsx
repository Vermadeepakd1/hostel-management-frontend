// src/pages/StudentDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { getStudentProfile, getAnnouncements, getStudentComplaints, getStudentFees } from '../api/apiService';
import { weeklyMenu } from '../data/menuData';
import { Link } from 'react-router-dom';
import { FaBell, FaExclamationCircle, FaFileInvoiceDollar, FaUtensils, FaCreditCard, FaCalendarTimes, FaExternalLinkAlt } from 'react-icons/fa'; // Added required icons

// A small helper component for styling the complaint status
const StatusBadge = ({ status }) => {
    const statusClasses = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Resolved': 'bg-green-100 text-green-800',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClasses[status]}`}>{status}</span>;
};

// Function to extract specific data from the announcement content
const parseFeeDetails = (content) => {
    const linkMatch = content.match(/Link:\s*(https?:\/\/\S+)/i);
    const startMatch = content.match(/Start Date:\s*(\d{2}\/\d{2}\/\d{4})/i);
    const endMatch = content.match(/End Date:\s*(\d{2}\/\d{2}\/\d{4})/i);
    const titleMatch = content.match(/Subject:\s*(.*?)(?:\s*\||$)/i); // Extract subject if present

    return {
        link: linkMatch ? linkMatch[1] : null,
        startDate: startMatch ? startMatch[1] : null,
        endDate: endMatch ? endMatch[1] : null,
        // Optional: clean content by removing tags
        cleanContent: content.replace(/#FEES_PIN|Link:\s*\S+|Start Date:\s*\S+|End Date:\s*\S+/gi, '').trim()
    };
};


function StudentDashboardPage() {
  const [profile, setProfile] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [fees, setFees] = useState([]);
  const [pinnedFeeNotice, setPinnedFeeNotice] = useState(null); // New state for pinned notice
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // This logic gets today's day and menu.
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todaysMenu = weeklyMenu[today];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileData, announcementsData, complaintsData, feesData] = await Promise.all([
          getStudentProfile(),
          getAnnouncements(),
          getStudentComplaints(),
          getStudentFees()
        ]);

        // 1. Find the pinned fee announcement using the keyword #FEES_PIN
        const feeNotice = announcementsData.find(ann => ann.title.toLowerCase().includes('#fees_pin') || ann.content.toLowerCase().includes('#fees_pin'));
        
        if (feeNotice) {
            // 2. Process the content to extract link and dates
            const details = parseFeeDetails(feeNotice.content);
            
            // 3. Set the combined notice object
            setPinnedFeeNotice({
                title: feeNotice.title.replace(/#FEES_PIN/i, '').trim(), // Clean title
                ...details
            });

            // 4. Filter the main announcement list to remove the pinned one
            setAnnouncements(announcementsData.filter(ann => ann.id !== feeNotice.id));
        } else {
            setAnnouncements(announcementsData);
        }

        setProfile(profileData);
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

  // Get the latest item from each list for the top widgets
  const latestAnnouncement = announcements[0];
  const latestComplaint = complaints[0];
  const latestFee = fees[0];
  
  // Calculate days remaining for pinned notice
  const daysRemaining = pinnedFeeNotice?.endDate ? Math.ceil((new Date(pinnedFeeNotice.endDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;
  const isOverdue = daysRemaining !== null && daysRemaining < 0;


  return (
    <div className="space-y-8">

      {/* NEW: PINNED CRITICAL FEE NOTICE */}
      {pinnedFeeNotice && (
        <div className={`bg-white rounded-xl shadow-lg p-6 border-l-8 ${isOverdue ? 'border-red-600' : 'border-blue-600'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FaCreditCard className={isOverdue ? 'text-red-600' : 'text-blue-600'} />
                        {pinnedFeeNotice.title || 'Fee Payment Notice'}
                    </h2>
                    <p className="text-gray-600 mt-1">{pinnedFeeNotice.cleanContent}</p>
                    
                    {/* Display Extracted Dates */}
                    <div className="text-sm text-gray-600 mt-2 space-y-1">
                        <p><strong>Start Date:</strong> {pinnedFeeNotice.startDate || 'N/A'}</p>
                        <p><strong>End Date:</strong> {pinnedFeeNotice.endDate || 'N/A'}</p>
                    </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                    <p className={`text-sm font-bold ${isOverdue ? 'text-red-600' : 'text-blue-600'}`}>
                        {isOverdue ? 'OVERDUE' : `${daysRemaining} DAYS LEFT`}
                    </p>
                    <p className="text-xs text-gray-500">Deadline: {pinnedFeeNotice.endDate || 'N/A'}</p>
                </div>
            </div>
            <div className="mt-4 border-t pt-4 flex justify-end">
                {pinnedFeeNotice.link && (
                    <a href={pinnedFeeNotice.link} target="_blank" rel="noopener noreferrer" 
                       className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-150 flex items-center gap-2">
                        Pay Fees Now
                        <FaExternalLinkAlt size={12} />
                    </a>
                )}
            </div>
        </div>
      )}
      {/* END PINNED NOTICE */}

      {/* ... Existing Widgets (3 Summary Widgets + Menu Section) ... */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* LATEST ANNOUNCEMENT WIDGET (Removed pinned notice from this list) */}
        <Link to="/student/announcements" className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow block">
          <div className="flex items-center text-blue-600 mb-3"><FaBell className="mr-2" /><h2 className="font-bold text-xl">Latest Announcement</h2></div>
          {latestAnnouncement ? (
            <div><p className="font-semibold text-gray-800">{latestAnnouncement.title}</p><p className="text-gray-500 mt-1 truncate">{latestAnnouncement.content}</p></div>
          ) : (<p className="text-gray-500 mt-2">No new announcements.</p>)}
        </Link>
        {/* Latest Complaint Widget */}
        <Link to="/student/complaints" className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow block">
          <div className="flex items-center text-blue-600 mb-3"><FaExclamationCircle className="mr-2" /><h2 className="font-bold text-xl">Latest Complaint</h2></div>
          {latestComplaint ? (
            <div className="flex justify-between items-start"><p className="text-gray-700 truncate pr-4">{latestComplaint.description}</p><StatusBadge status={latestComplaint.status} /></div>
          ) : (<p className="text-gray-500 mt-2">You have no recent complaints.</p>)}
        </Link>
        {/* Last Fee Payment Widget */}
        <Link to="/student/fees" className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow block">
          <div className="flex items-center text-blue-600 mb-3"><FaFileInvoiceDollar className="mr-2" /><h2 className="font-bold text-xl">Last Fee Payment</h2></div>
          {latestFee ? (
            <div><p className="font-semibold text-2xl text-gray-800">₹{latestFee.amount_paid}</p><p className="text-gray-500 mt-1">Paid on: {new Date(latestFee.payment_date).toLocaleDateString()}</p></div>
          ) : (<p className="text-gray-500 mt-2">No recent payment history.</p>)}
        </Link>
      </div>

      {/* Full-Width "Today's Menu" Section */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-blue-600">
                <FaUtensils className="mr-3" size={24} />
                <h2 className="font-bold text-2xl">Today's Menu ({today})</h2>
            </div>
            <Link to="/student/menu" className="text-blue-600 hover:underline font-semibold">View Full Menu</Link>
        </div>
        {todaysMenu ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 border-b pb-1 mb-2">Breakfast</h3>
              <p className="text-gray-600">{todaysMenu.breakfast.join(', ')}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 border-b pb-1 mb-2">Lunch</h3>
              <p className="text-gray-600">{todaysMenu.lunch.join(', ')}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 border-b pb-1 mb-2">Snacks</h3>
              <p className="text-gray-600">{todaysMenu.snacks.join(', ')}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 border-b pb-1 mb-2">Dinner</h3>
              <p className="text-gray-600">{todaysMenu.dinner.join(', ')}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 mt-2">Menu not available for today.</p>
        )}
      </div>
    </div>
  );
}

export default StudentDashboardPage;