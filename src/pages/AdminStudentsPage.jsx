// src/pages/AdminStudentsPage.jsx

import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal'; // Assuming Modal uses the consistent style
import StudentForm from '../components/StudentForm'; // Assuming Form uses the consistent style
import { getStudents, addStudent, updateStudent, deleteStudent } from '../api/apiService';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiPrinter } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const INITIAL_STUDENT_STATE = {
  name: '', roll_no: '', email: '', phone: '', room_no: '',
  department: '', year: '', gender: '', dob: '', address: '',
  guardian_name: '', guardian_phone: ''
};

// Skeleton Loader using original colors
const StudentTableSkeleton = () => (
   <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
     <div className="flex justify-between border-b border-gray-200 pb-3 mb-4">
        <Skeleton width={80} height={20}/>
        <Skeleton width={100} height={20}/>
        <Skeleton width={70} height={20}/>
        <Skeleton width={90} height={20}/>
     </div>
     <div className="space-y-4">
        {[...Array(5)].map((_, i) => ( // Render 5 placeholder rows
         <div key={i} className="flex justify-between items-center">
             <Skeleton width="25%"/>
             <Skeleton width="20%"/>
             <Skeleton width="15%"/>
             <Skeleton width="10%"/>
         </div>
        ))}
     </div>
   </div>
);


function AdminStudentsPage() {
  const [students, setStudents] = useState([]); // Master list from API
  const [filteredStudents, setFilteredStudents] = useState([]); // List to display
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedStudent, setSelectedStudent] = useState(INITIAL_STUDENT_STATE);
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
 
  // Opens the dedicated print page in a new tab
  const handlePrint = () => {
    window.open('/admin/students/print', '_blank');
  };

  // Fetches all students from the backend
  const fetchStudents = async () => {
    try {
      setIsLoading(true); // Ensure loading starts on refetch
      const data = await getStudents();
      setStudents(data);
      // Filtering is handled by the useEffect below, don't setFilteredStudents here initially
    } catch (err) {
      setError('Failed to fetch students. Please log in again.');
      console.error(err); // Keep console error for debugging
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch students when the component first loads
  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter logic: runs when master list or search query changes
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const result = students.filter(student =>
      student.name?.toLowerCase().includes(query) ||
      student.roll_no?.toLowerCase().includes(query)
    );
    setFilteredStudents(result);
  }, [searchQuery, students]);

  // Opens the modal in 'add' mode with a blank form
  const openAddModal = () => {
    setModalMode('add');
    setSelectedStudent(INITIAL_STUDENT_STATE); // Reset form state
    setIsModalOpen(true);
  };

  // Opens the modal in 'edit' mode, pre-filled with the selected student's data
  const openEditModal = (student) => {
    setModalMode('edit');
    setSelectedStudent(student); // Set form state to the student being edited
    setIsModalOpen(true);
  };

  // Handles saving (either adding or updating) a student
  const handleSaveStudent = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await addStudent(selectedStudent);
      } else {
        // Ensure student id is included for update requests if needed by backend
        await updateStudent(selectedStudent.id, selectedStudent);
      }
      setIsModalOpen(false); // Close modal on success
      fetchStudents(); // Refresh the student list
    } catch (err) {
      console.error("Failed to save student:", err);
      // Consider adding a state to show save errors within the modal
    }
  };

  // Handles deleting a student after confirmation
  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id);
        fetchStudents(); // Refresh the student list
      } catch (err) {
        console.error("Failed to delete student:", err);
        // Consider adding user feedback for deletion errors
      }
    }
  };

  // Display skeleton loader while data is being fetched
  if (isLoading) return <StudentTableSkeleton />;

  return (
    <div className="space-y-6"> {/* Adds vertical spacing between elements */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Manage Students</h1>
        <div className="flex flex-shrink-0 space-x-2"> {/* Prevents buttons wrapping awkwardly */}
          {/* Print Button - Styled consistently */}
          <button onClick={handlePrint} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-150 ease-in-out transform hover:scale-105">
            <FiPrinter /><span>Print List</span>
          </button>
          {/* Add Student Button - Styled consistently */}
          <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-150 ease-in-out transform hover:scale-105">
            <FiPlus /><span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Search Bar - Styled consistently */}
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
      
      {/* Error Message Display */}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      
      {/* Student List Table - Styled consistently */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto"> {/* Ensures table scrolls horizontally on small screens */}
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
      
      {/* Modal for Add/Edit Student Form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? 'Add New Student' : 'Edit Student'}>
        <StudentForm
          student={selectedStudent}
          setStudent={setSelectedStudent}
          onSave={handleSaveStudent}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default AdminStudentsPage;