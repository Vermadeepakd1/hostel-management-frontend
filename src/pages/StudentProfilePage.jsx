// src/pages/StudentProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { getStudentProfile, changeStudentPassword } from '../api/apiService';
import Modal from '../components/Modal';

function StudentProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for password change form
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

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

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    try {
      const response = await changeStudentPassword(passwords.oldPassword, passwords.newPassword);
      setPasswordSuccess(response.message);
      setPasswords({ oldPassword: '', newPassword: '' });
      // Optionally close modal after a delay
      setTimeout(() => setIsModalOpen(false), 2000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) return <p>Loading your profile...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">
          Change Password
        </button>
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow-md border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><p className="font-semibold">Name:</p><p>{profile.name}</p></div>
          <div><p className="font-semibold">Roll Number:</p><p>{profile.roll_no}</p></div>
          <div><p className="font-semibold">Email:</p><p>{profile.email}</p></div>
          <div><p className="font-semibold">Phone:</p><p>{profile.phone}</p></div>
          <div><p className="font-semibold">Room Number:</p><p>{profile.room_no}</p></div>
          <div><p className="font-semibold">Department:</p><p>{profile.department}</p></div>
          <div><p className="font-semibold">Year:</p><p>{profile.year}</p></div>
          <div><p className="font-semibold">Gender:</p><p>{profile.gender}</p></div>
          <div className="md:col-span-2"><p className="font-semibold">Address:</p><p>{profile.address}</p></div>
          <div><p className="font-semibold">Guardian's Name:</p><p>{profile.guardian_name}</p></div>
          <div><p className="font-semibold">Guardian's Phone:</p><p>{profile.guardian_phone}</p></div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Change Your Password">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {passwordError && <p className="text-red-500">{passwordError}</p>}
          {passwordSuccess && <p className="text-green-500">{passwordSuccess}</p>}
          <div>
            <label className="block text-sm font-medium">Old Password</label>
            <input name="oldPassword" value={passwords.oldPassword} onChange={handleInputChange} type="password" className="w-full p-2 border rounded mt-1" required />
          </div>
          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input name="newPassword" value={passwords.newPassword} onChange={handleInputChange} type="password" className="w-full p-2 border rounded mt-1" required />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">Update Password</button>
        </form>
      </Modal>
    </div>
  );
}

export default StudentProfilePage;