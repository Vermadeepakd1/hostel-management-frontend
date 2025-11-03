// src/pages/AdminStudentsPage.jsx

import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal'; 
import StudentForm from '../components/StudentForm';
import { getStudents, addStudent, updateStudent, deleteStudent, uploadStudentsCSV } from '../api/apiService';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiPrinter, FiUpload } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const INITIAL_STUDENT_STATE = {
  name: '', roll_no: '', email: '', phone: '', room_no: '',
  department: '', year: '', gender: '', dob: '', address: '',
  guardian_name: '', guardian_phone: ''
};

// Skeleton Loader (No changes here)
const StudentTableSkeleton = () => (
   <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
     {/* ... skeleton code ... */}
   </div>
);


function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); 
  const [selectedStudent, setSelectedStudent] = useState(INITIAL_STUDENT_STATE);
  const [searchQuery, setSearchQuery] = useState(''); 
  
  // (State for the upload modal and file)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  // Fetches all students from the backend
  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      setError('Failed to fetch students. Please log in again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle Print (No changes)
  const handlePrint = () => {
    window.open('/admin/students/print', '_blank');
  };

  // Fetch students when the component first loads
  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter logic (No changes)
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const result = students.filter(student =>
      student.name?.toLowerCase().includes(query) ||
      student.roll_no?.toLowerCase().includes(query)
    );
    setFilteredStudents(result);
  }, [searchQuery, students]);

  // Opens the modal in 'add' mode (No changes)
  const openAddModal = () => {
    setModalMode('add');
    setSelectedStudent(INITIAL_STUDENT_STATE);
    setIsModalOpen(true);
  };

  // Opens the modal in 'edit' mode (No changes)
  const openEditModal = (student) => {
    setModalMode('edit');
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  // Handles saving (either adding or updating) a student (No changes)
  const handleSaveStudent = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await addStudent(selectedStudent);
      } else {
        await updateStudent(selectedStudent.id, selectedStudent);
      }
      setIsModalOpen(false); 
      fetchStudents(); 
    } catch (err) {
      console.error("Failed to save student:", err);
    }
  };

  // Handles deleting a student (No changes)
  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id);
        fetchStudents();
      } catch (err) {
        console.error("Failed to delete student:", err);
      }
    }
  };

  // (Handler functions for CSV Upload)
  const openUploadModal = () => {
    setSelectedFile(null);
    setUploadError(null);
    setUploadSuccess(null);
    setIsUploadModalOpen(true);
  };

  // Updates state when a file is selected
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadError(null); // Clear previous errors
    setUploadSuccess(null); // Clear previous success
  };

  // Handles the file submission
  const handleCsvUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file first.");
      return;
    }

    try {
      const response = await uploadStudentsCSV(selectedFile);
      setUploadSuccess(response.message); // Show success message
      setUploadError(null);
      setSelectedFile(null); // Clear file input
      setIsUploadModalOpen(false); // Close modal on success
      fetchStudents(); // Refresh the student list
      
      // Optionally alert user
      alert(response.message); 

    } catch (err) {
      console.error("Upload failed:", err);
      setUploadError(err.message || "An unknown error occurred.");
      setUploadSuccess(null);
    }
  };


  // Display skeleton loader (No changes)
  if (isLoading) return <StudentTableSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Manage Students</h1>
        
        {/* (Button container - no changes) */}
        <div className="flex flex-shrink-0 space-x-2">
          {/* Print Button */}
          <button onClick={handlePrint} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-150 ease-in-out transform hover:scale-105">
            <FiPrinter /><span>Print List</span>
          </button>
          
          {/* (Upload CSV Button) */}
          <button onClick={openUploadModal} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-150 ease-in-out transform hover:scale-105">
            <FiUpload /><span>Upload CSV</span>
          </button>
          
          {/* Add Student Button */}
          <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-150 ease-in-out transform hover:scale-105">
            <FiPlus /><span>Add Student</span>
          </button>
        </div>
        
      </div>

      {/* Search Bar (No changes) */}
      <div className="relative">
        <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or roll number..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        />
      </div>
      
      {/* Error Message Display (No changes) */}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      
      {/* --- MODIFIED --- (This is the fixed table section) */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Display filtered students or a message if none found */}
                {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.roll_no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.room_no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-4">
                        <button onClick={() => openEditModal(student)} className="text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out transform hover:scale-110" title="Edit"><FiEdit size={18} /></button>
                        <button onClick={() => handleDeleteStudent(student.id)} className="text-red-600 hover:text-red-700 transition duration-150 ease-in-out transform hover:scale-110" title="Delete"><FiTrash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                   <tr><td colSpan="4" className="text-center py-10 text-gray-500">No students found matching your filters.</td></tr>
                )}
              </tbody>
            </table>
        </div>
      </div>
      {/* --- END MODIFIED --- */}
      
      {/* Modal for Add/Edit Student Form (No changes) */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? 'Add New Student' : 'Edit Student'}>
        <StudentForm
          student={selectedStudent}
          setStudent={setSelectedStudent}
          onSave={handleSaveStudent}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* (Modal for CSV Upload - no changes) */}
      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Upload Student CSV">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Select a .csv file to upload. Make sure it has the required headers: <br />
            <code className="text-xs bg-gray-100 p-1 rounded">name, roll_no, email, phone, gender, dob, address, guardian_name, guardian_phone, room_no, department, year</code>
          </p>
          
          {/* File Input */}
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          
          {/* Display Error/Success Messages */}
          {uploadError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {uploadError}
            </div>
          )}
          {uploadSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {uploadSuccess}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-150"
            >
              Cancel
            </button>
            <button
              onClick={handleCsvUpload}
              disabled={!selectedFile} // Disable button if no file is selected
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload File
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}

export default AdminStudentsPage;