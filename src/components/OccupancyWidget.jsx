// src/components/OccupancyWidget.jsx

import React, { useState, useEffect } from 'react';
import { getRooms } from '../api/apiService';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function OccupancyWidget() {
  const [occupancyByFloor, setOccupancyByFloor] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndProcessRooms = async () => {
      try {
        const rooms = await getRooms();
        
        // This logic groups rooms by their floor number (e.g., '101' -> floor '1')
        const floors = rooms.reduce((acc, room) => {
          const floor = room.room_number.charAt(0);
          if (!acc[floor]) {
            acc[floor] = { totalCapacity: 0, currentOccupancy: 0 };
          }
          acc[floor].totalCapacity += room.capacity;
          acc[floor].currentOccupancy += room.current_occupancy;
          return acc;
        }, {});

        // Calculate the percentage for each floor
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
  }, []);

  if (isLoading) {
    return <div className="bg-white p-6 rounded-lg shadow-md border"><p>Loading Occupancy...</p></div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Occupancy by Floor</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(occupancyByFloor).map(([floor, data]) => (
          <div key={floor} className="flex flex-col items-center">
            <div style={{ width: 80, height: 80 }}>
              <CircularProgressbar
                value={data.percentage}
                text={`${data.percentage}%`}
                styles={buildStyles({
                  textColor: '#333',
                  pathColor: '#3b82f6', // A nice blue color
                  trailColor: '#d6d6d6',
                })}
              />
            </div>
            <p className="mt-2 font-semibold text-gray-600">Floor {floor}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OccupancyWidget;