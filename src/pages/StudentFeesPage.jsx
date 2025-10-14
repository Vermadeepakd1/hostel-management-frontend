// src/pages/StudentFeesPage.jsx

import React, { useState, useEffect } from 'react';
import { getStudentFees } from '../api/apiService';

function StudentFeesPage() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const data = await getStudentFees();
        setPayments(data);
      } catch (err) {
        setError('Failed to fetch your fee history. Please log in again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFees();
  }, []);

  if (isLoading) return <p>Loading your payment history...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Fee History</h1>
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="bg-white shadow-md rounded-lg overflow-x-auto border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* CORRECTED: Updated table headers */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount Paid</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.length > 0 ? (
              payments.map((payment) => (
                // CORRECTED: Added the unique key prop
                <tr key={payment.id} className="hover:bg-gray-50">
                  {/* CORRECTED: Using the correct data field 'amount_paid' */}
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{payment.amount_paid}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(payment.payment_date).toLocaleDateString()}</td>
                  {/* CORRECTED: Using the correct data field 'remarks' */}
                  <td className="px-6 py-4 text-sm text-gray-600">{payment.remarks}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-10 text-gray-500">
                  You have no payment history yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentFeesPage;