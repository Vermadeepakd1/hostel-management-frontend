// src/pages/PrintableStudentsPage.jsx

import React, { useState, useEffect } from 'react';
import { getStudents } from '../api/apiService';

function PrintableStudentsPage() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndPrint = async () => {
      try {
        const data = await getStudents();
        setStudents(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch students for printing:", error);
        setIsLoading(false);
      }
    };
    fetchAndPrint();
  }, []);

  // This useEffect will run after the data is loaded and the component has rendered.
  useEffect(() => {
    if (!isLoading && students.length > 0) {
      window.print(); // This opens the browser's print dialog automatically
    }
  }, [isLoading, students]);

  if (isLoading) return <p>Preparing document for printing...</p>;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-2">Hostel Student List</h1>
      <p className="text-sm text-gray-500 mb-6">Generated on: {new Date().toLocaleString('en-IN')}</p>
      <table className="min-w-full divide-y divide-gray-300 border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Roll No</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Room No</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map((student) => (
            <tr key={student.id}>
              <td className="px-4 py-2">{student.name}</td>
              <td className="px-4 py-2">{student.roll_no}</td>
              <td className="px-4 py-2">{student.room_no}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PrintableStudentsPage;