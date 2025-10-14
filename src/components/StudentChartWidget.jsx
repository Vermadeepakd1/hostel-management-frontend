// src/components/StudentChartWidget.jsx

import React, { useState, useEffect } from 'react';
import { getStudents } from '../api/apiService';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// We need to register the components we'll use from Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function StudentChartWidget() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchAndProcessStudents = async () => {
      try {
        const students = await getStudents();
        
        // This logic counts how many students are in each year
        const yearCounts = students.reduce((acc, student) => {
          const year = student.year || 'N/A';
          acc[year] = (acc[year] || 0) + 1;
          return acc;
        }, {});

        const data = {
          labels: Object.keys(yearCounts).map(year => `${year}-Year`), // e.g., "1-Year", "2-Year"
          datasets: [
            {
              label: 'Number of Students',
              data: Object.values(yearCounts),
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 1,
            },
          ],
        };
        setChartData(data);
      } catch (error) {
        console.error("Failed to process student data for chart:", error);
      }
    };
    fetchAndProcessStudents();
  }, []);

  if (!chartData) {
    return <div className="bg-white p-6 rounded-lg shadow-md border"><p>Loading Student Data...</p></div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Student Distribution by Year</h3>
      <Bar data={chartData} />
    </div>
  );
}

export default StudentChartWidget;