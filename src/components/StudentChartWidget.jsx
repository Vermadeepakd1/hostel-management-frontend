// src/components/StudentChartWidget.jsx

import React, { useState, useEffect } from 'react';
import { getStudents } from '../api/apiService';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Skeleton from 'react-loading-skeleton'; // 1. Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Import Skeleton CSS

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Helper function to create user-friendly labels
const getYearLabel = (yearValue) => {
  if (!yearValue || yearValue === 'N/A') return 'N/A';
  if (yearValue.startsWith('BTech')) return `B.Tech ${yearValue.split('-')[1] || ''} Year`;
  if (yearValue.startsWith('MTech')) return `M.Tech ${yearValue.split('-')[1] || ''} Year`;
  if (yearValue === 'PhD') return 'PhD Scholar';
  // Fallback for simple numbers if they still exist
  if (/^\d+$/.test(yearValue)) return `${yearValue}-Year`;
  return yearValue;
};

// Skeleton Loader Component
const ChartSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-md border">
    <h3 className="text-lg font-semibold text-gray-700 mb-4"><Skeleton width={200} /></h3>
    {/* Placeholder for the chart area */}
    <Skeleton height={200} />
  </div>
);


function StudentChartWidget() {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndProcessStudents = async () => {
      setIsLoading(true);
      try {
        const students = await getStudents();
        const yearCounts = students.reduce((acc, student) => {
          const year = student.year || 'N/A';
          acc[year] = (acc[year] || 0) + 1;
          return acc;
        }, {});

        const sortedYears = Object.keys(yearCounts).sort((a, b) => {
          // Basic sort order
          if (a.startsWith('BTech') && !b.startsWith('BTech')) return -1;
          if (!a.startsWith('BTech') && b.startsWith('BTech')) return 1;
          if (a.startsWith('MTech') && !b.startsWith('MTech')) return -1;
          if (!a.startsWith('MTech') && b.startsWith('MTech')) return 1;
          return a.localeCompare(b);
        });

        const data = {
          labels: sortedYears.map(year => getYearLabel(year)),
          datasets: [
            {
              label: 'Number of Students',
              data: sortedYears.map(year => yearCounts[year]),
              backgroundColor: 'rgba(59, 130, 246, 0.6)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 1,
            },
          ],
        };
        setChartData(data);
      } catch (error) {
        console.error("Failed to process student data for chart:", error);
      } finally {
         setIsLoading(false);
      }
    };
    fetchAndProcessStudents();
  }, []);

  // Render Skeleton while loading or if data failed
  if (isLoading || !chartData) {
    return <ChartSkeleton />;
  }

  // Render actual chart when loaded
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Student Distribution</h3>
      <Bar
        data={chartData}
        options={{
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Students by Year/Program' }
            },
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } }
            }
        }}
      />
    </div>
  );
}

export default StudentChartWidget;