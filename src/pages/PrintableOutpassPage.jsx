// src/pages/PrintableOutpassPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// We only need the existing API functions
import { getStudentOutpasses, getStudentProfile } from '../api/apiService';
import IIITDMLogo from '../assets/iiitdm_kurnool_logo.jpeg';

function PrintableOutpassPage() {
  const { id } = useParams(); // Gets the outpass ID from the URL
  const [outpass, setOutpass] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndPrint = async () => {
      try {
        // Fetch all necessary data using existing endpoints
        const [allOutpasses, profileData] = await Promise.all([
          getStudentOutpasses(),
          getStudentProfile(),
        ]);
        
        // Find the specific outpass from the list
        const specificOutpass = allOutpasses.find(pass => pass.id === parseInt(id));

        setOutpass(specificOutpass);
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to fetch data for printing:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndPrint();
  }, [id]);

  // This useEffect triggers the print dialog after the data has been loaded
  useEffect(() => {
    if (!isLoading && outpass) {
      window.print();
    }
  }, [isLoading, outpass]);

  if (isLoading) return <p className="text-center p-10">Preparing Out Pass for printing...</p>;
  if (!outpass || !profile) return <p className="text-center p-10 text-red-500">Could not load out pass data.</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto border m-10">
      <div className="flex items-center justify-between border-b pb-4">
        <img src={IIITDMLogo} alt="Logo" className="h-16 w-auto" />
        <h1 className="text-3xl font-bold text-gray-800">HOSTEL OUT PASS</h1>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4">
        <div><p className="font-semibold text-gray-500">Student Name:</p><p className="text-lg">{profile.name}</p></div>
        <div><p className="font-semibold text-gray-500">Roll Number:</p><p className="text-lg">{profile.roll_no}</p></div>
        <div><p className="font-semibold text-gray-500">Room Number:</p><p className="text-lg">{profile.room_no}</p></div>
        <div className="col-span-2"><p className="font-semibold text-gray-500">Reason:</p><p className="text-lg">{outpass.reason}</p></div>
        <div><p className="font-semibold text-gray-500">Departure Time:</p><p className="text-lg font-mono">{new Date(outpass.departure_time).toLocaleString('en-IN')}</p></div>
        <div><p className="font-semibold text-gray-500">Expected Return:</p><p className="text-lg font-mono">{new Date(outpass.expected_return_time).toLocaleString('en-IN')}</p></div>
      </div>
      <div className="mt-16 flex justify-between items-end">
        <div>
            <p className="text-xs text-gray-400">Generated on: {new Date().toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-400">Status: <span className="font-bold text-green-600">{outpass.status}</span></p>
        </div>
        <div className="border-t-2 border-gray-400 w-1/3 pt-1 text-center font-semibold">
            Warden's Signature
        </div>
      </div>
    </div>
  );
}

export default PrintableOutpassPage;