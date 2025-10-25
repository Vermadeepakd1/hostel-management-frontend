// src/components/OccupancyWidget.jsx

import React, { useState, useEffect } from 'react';
import { getRooms } from '../api/apiService';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Import Skeleton CSS

function OccupancyWidget() {
  const [occupancyByFloor, setOccupancyByFloor] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndProcessRooms = async () => {
      try {
        const rooms = await getRooms();

        // Group rooms by floor number (e.g., '101' -> floor '1')
        const floors = rooms.reduce((acc, room) => {
          // Ensure room_number exists and is a string
          const roomNumberStr = String(room.room_number || '');
          const floor = roomNumberStr.charAt(0);
          // Only process if floor is a digit (basic check)
          if (floor && /^\d+$/.test(floor)) {
            if (!acc[floor]) {
              acc[floor] = { totalCapacity: 0, currentOccupancy: 0 };
            }
            acc[floor].totalCapacity += room.capacity || 0;
            acc[floor].currentOccupancy += room.current_occupancy || 0;
          }
          return acc;
        }, {});

        // Calculate percentage for each floor
        for (const floor in floors) {
          const { totalCapacity, currentOccupancy } = floors[floor];
          floors[floor].percentage = totalCapacity > 0 ? Math.round((currentOccupancy / totalCapacity) * 100) : 0;
        }

        setOccupancyByFloor(floors);
      } catch (error) {
        console.error("Failed to fetch room data for widget:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndProcessRooms();
  }, []); // Empty dependency array means this runs once on mount

  // Skeleton Loader Component
  const OccupancySkeleton = () => (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h3 className="text-lg font-semibold text-gray-700 mb-4"><Skeleton width={150} /></h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => ( // Render 4 placeholder circles
          <div key={i} className="flex flex-col items-center">
            <Skeleton circle={true} height={80} width={80} />
            <p className="mt-2"><Skeleton width={50} /></p>
          </div>
        ))}
      </div>
    </div>
  );

  // Render Skeleton while loading
  if (isLoading) {
    return <OccupancySkeleton />;
  }

  // Render actual content when loaded
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Occupancy by Floor</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.keys(occupancyByFloor).length > 0 ? (
          Object.entries(occupancyByFloor).map(([floor, data]) => (
            <div key={floor} className="flex flex-col items-center">
              <div style={{ width: 80, height: 80 }}>
                <CircularProgressbar
                  value={data.percentage}
                  text={`${data.percentage}%`}
                  styles={buildStyles({
                    textColor: '#333333', // text-light
                    pathColor: '#4A90E2', // primary
                    trailColor: '#d1d5db', // gray-300
                    textSize: '24px',
                  })}
                />
              </div>
              <p className="mt-2 font-semibold text-gray-600">Floor {floor}</p>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 py-4">No room data available to display occupancy.</p>
        )}
      </div>
    </div>
  );
}

export default OccupancyWidget;