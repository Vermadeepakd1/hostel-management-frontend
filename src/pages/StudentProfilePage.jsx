// src/pages/StudentProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { getStudentProfile, changeStudentPassword } from '../api/apiService';
import Modal from '../components/Modal';
import { FiEdit } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// --- THIS IS THE CORRECTED SKELETON DEFINITION ---
const ProfileSkeleton = () => (
  <div>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h1 className="text-3xl font-bold"><Skeleton width={150} /></h1>
      <Skeleton width={160} height={40} borderRadius="0.5rem" /> {/* Added border radius */}
    </div>
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
        {[...Array(10)].map((_, i) => ( // Render 10 placeholder lines
          <div key={i}>
            <p className="text-sm font-medium text-gray-500"><Skeleton width={100} /></p>
            <p className="text-lg"><Skeleton width={180} /></p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
// --- END OF SKELETON DEFINITION ---


function StudentProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
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

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setIsPasswordLoading(true);
    try {
      const response = await changeStudentPassword(passwords.oldPassword, passwords.newPassword);
      setPasswordSuccess(response.message);
      setPasswords({ oldPassword: '', newPassword: '' });
      setTimeout(() => setIsModalOpen(false), 2000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const openPasswordModal = () => {
    setPasswords({ oldPassword: '', newPassword: '' });
    setPasswordError('');
    setPasswordSuccess('');
    setIsModalOpen(true);
  }

  if (isLoading) return <ProfileSkeleton />;
  if (error) return <p className="text-red-500 bg-red-100 p-4 rounded-lg border border-red-300">{error}</p>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <button
          onClick={openPasswordModal}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ease-in-out transform hover:scale-105"
        >
          <FiEdit />
          <span>Change Password</span>
        </button>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {renderProfileField("Name", profile.name)}
          {renderProfileField("Roll Number", profile.roll_no)}
          {renderProfileField("Email", profile.email)}
          {renderProfileField("Phone", profile.phone)}
          {renderProfileField("Room Number", profile.room_no)}
          {renderProfileField("Department", profile.department)}
          {renderProfileField("Year", profile.year)}
          {renderProfileField("Gender", profile.gender)}
          {renderProfileField("Guardian's Name", profile.guardian_name)}
          {renderProfileField("Guardian's Phone", profile.guardian_phone)}
          <div className="md:col-span-2">
            {renderProfileField("Address", profile.address)}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Change Your Password">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {passwordError && <p className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">{passwordError}</p>}
          {passwordSuccess && <p className="text-sm text-green-600 bg-green-50 p-3 rounded border border-green-200">{passwordSuccess}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
            <input name="oldPassword" value={passwords.oldPassword} onChange={handleInputChange} type="password" className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input name="newPassword" value={passwords.newPassword} onChange={handleInputChange} type="password" className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150" required minLength={6} />
             <p className="text-xs text-gray-500 mt-1">Minimum 6 characters required.</p>
          </div>
          <button type="submit" disabled={isPasswordLoading} className="w-full bg-blue-600 text-white p-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-150 disabled:opacity-50 transform hover:scale-105">
            {isPasswordLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </Modal>
    </div>
  );
}

// Helper function remains the same
const renderProfileField = (label, value) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}:</p>
    <p className="text-lg text-gray-800">{value || '-'}</p>
  </div>
);

export default StudentProfilePage;