// src/pages/AdminFeePage.jsx

import React, { useState, useEffect } from 'react';
import { getStudents, getStudentFeeHistory, addFeePayment } from '../api/apiService';
import StudentSearch from '../components/StudentSearch'; // Import the new component

function AdminFeePage() {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [feeHistory, setFeeHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for the new payment form, matching the backend fields
  const [newPayment, setNewPayment] = useState({
    student_id: '',
    amount_paid: '',
    payment_date: new Date().toISOString().split('T')[0], // Default to today
    remarks: ''
  });

  useEffect(() => {
    getStudents().then(setStudents);
  }, []);

  useEffect(() => {
    if (selectedStudentId) {
      getStudentFeeHistory(selectedStudentId).then(setFeeHistory);
      setNewPayment(prev => ({ ...prev, student_id: selectedStudentId }));
    } else {
      setFeeHistory([]);
    }
  }, [selectedStudentId]);

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
      setIsLoading(true);
      await addFeePayment(newPayment);
      getStudentFeeHistory(selectedStudentId).then(setFeeHistory);
      // Reset form but keep student_id
      setNewPayment({
        student_id: selectedStudentId,
        amount_paid: '',
        payment_date: new Date().toISOString().split('T')[0],
        remarks: ''
      });
    } catch (err) {
      console.error("Failed to add payment:", err);
      alert('Failed to add payment. Check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Fee Management</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Find Student</label>
        <StudentSearch students={students} onSelectStudent={setSelectedStudentId} />
      </div>

      {selectedStudentId && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-xl font-bold mb-4">Record New Payment</h2>
            <form onSubmit={handleAddPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Amount Paid</label>
                <input name="amount_paid" value={newPayment.amount_paid} onChange={handleInputChange} type="number" className="w-full p-2 border rounded mt-1" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Payment Date</label>
                <input name="payment_date" value={newPayment.payment_date} onChange={handleInputChange} type="date" className="w-full p-2 border rounded mt-1" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Remarks (e.g., August Mess Fee)</label>
                <textarea name="remarks" value={newPayment.remarks} onChange={handleInputChange} className="w-full p-2 border rounded mt-1" rows="3"></textarea>
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                {isLoading ? 'Saving...' : 'Record Payment'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-xl font-bold mb-4">Payment History</h2>
            {/* ... The table remains the same ... */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {feeHistory.map(payment => (
                  <tr key={payment.id}>
                    <td className="px-4 py-3">₹{payment.amount_paid}</td>
                    <td className="px-4 py-3">{new Date(payment.payment_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{payment.remarks}</td>
                  </tr>
                ))}
                {feeHistory.length === 0 && <tr><td colSpan="3" className="text-center py-4">No payment history found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminFeePage;