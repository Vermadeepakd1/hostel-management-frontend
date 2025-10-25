// src/pages/AdminFeePage.jsx

import React, { useState, useEffect } from 'react';
// 1. Removed 'getAllFeeHistory' which was causing the error
import { getStudents, getStudentFeeHistory, addFeePayment } from '../api/apiService';
import StudentSearch from '../components/StudentSearch';
import Modal from '../components/Modal';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';

function AdminFeePage() {
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [feeHistory, setFeeHistory] = useState([]);
  
  // State for loading the student-specific history table
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  // State for the "Add Payment" Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStudentId, setModalStudentId] = useState('');
  const [newPayment, setNewPayment] = useState({
    student_id: '',
    amount_paid: '',
    payment_date: new Date().toISOString().split('T')[0],
    remarks: ''
  });

  // Get all students for search (modal + main page)
  useEffect(() => {
    getStudents().then(setAllStudents);
  }, []);

  // 2. This effect now runs when you select a student, just like your original code
  useEffect(() => {
    if (selectedStudentId) {
      setIsLoadingHistory(true);
      getStudentFeeHistory(selectedStudentId)
        .then(setFeeHistory)
        .catch(err => console.error("Failed to fetch student history:", err))
        .finally(() => setIsLoadingHistory(false));
    } else {
      setFeeHistory([]); // Clear history if no student is selected
    }
  }, [selectedStudentId]);

  // --- Modal Handlers ---

  const openAddModal = () => {
    // Reset the form when opening the modal
    setModalStudentId('');
    setNewPayment({
      student_id: '',
      amount_paid: '',
      payment_date: new Date().toISOString().split('T')[0],
      remarks: ''
    });
    setIsModalOpen(true);
  };

  // This runs when a student is selected *inside the modal*
  const handleModalStudentSelect = (studentId) => {
    setModalStudentId(studentId);
    setNewPayment(prev => ({ ...prev, student_id: studentId }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPayment(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!newPayment.student_id || !newPayment.amount_paid) {
      alert('Please select a student and enter an amount.');
      return;
    }
    try {
      await addFeePayment(newPayment);
      setIsModalOpen(false); // Close modal on success
      
      // 3. Refresh the history if the new payment was for the selected student
      if (newPayment.student_id === selectedStudentId) {
        getStudentFeeHistory(selectedStudentId).then(setFeeHistory);
      } else {
        // If they paid for a *different* student, update the main view to that student
        setSelectedStudentId(newPayment.student_id);
      }
    } catch (err) {
      console.error("Failed to add payment:", err);
      alert('Failed to add payment.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* --- Page Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Fee Management</h1>
        <button 
          onClick={openAddModal} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-all duration-300"
        >
          <FiPlus /><span>Record Payment</span>
        </button>
      </div>

      {/* --- Student Search Bar (Main Page) --- */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Find Student to View Payment History
        </label>
        <StudentSearch 
          students={allStudents} 
          onSelectStudent={setSelectedStudentId} 
        />
      </div>

      {/* --- Conditional History Table --- */}
      {isLoadingHistory && (
        <p className="text-gray-500 text-center py-4">Loading history...</p>
      )}
      
      {!isLoadingHistory && selectedStudentId && (
        // 4. Animate the table appearing when a student is selected
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white shadow-md rounded-lg overflow-x-auto border"
        >
          <h2 className="text-xl font-bold mb-0 p-4 border-b">Payment History</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {feeHistory.length > 0 ? (
                feeHistory.map((payment) => (
                  <motion.tr
                    key={payment.id}
                    className="hover:bg-gray-50 transition-all duration-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">₹{payment.amount_paid}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(payment.payment_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{payment.remarks || '-'}</td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-500">
                    No payment history found for this student.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* --- Add Payment Modal (This logic is unchanged and correct) --- */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record New Payment">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">1. Find Student</label>
            <StudentSearch 
              students={allStudents} 
              onSelectStudent={handleModalStudentSelect} 
            />
          </div>
          
          {modalStudentId && (
            <motion.form 
              onSubmit={handleAddPayment} 
              className="space-y-4 pt-4 border-t"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-lg font-medium">2. Enter Payment Details</h3>
              <div>
                <label className="block text-sm font-medium">Amount Paid</label>
                <input 
                  name="amount_paid" 
                  value={newPayment.amount_paid} 
                  onChange={handleInputChange} 
                  type="number" 
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Payment Date</label>
                <input 
                  name="payment_date" 
                  value={newPayment.payment_date} 
                  onChange={handleInputChange} 
                  type="date" 
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Remarks (e.g., August Mess Fee)</label>
                <textarea 
                  name="remarks" 
                  value={newPayment.remarks} 
                  onChange={handleInputChange} 
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150" 
                  rows="3"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-150"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-150 disabled:bg-blue-300"
                >
                  Record Payment
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </Modal>
    </motion.div>
  );
}

export default AdminFeePage;