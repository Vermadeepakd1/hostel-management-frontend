// src/pages/StudentMessMenuPage.jsx

import React from 'react';
import { weeklyMenu } from '../data/menuData'; // Assuming this data is correct

// Helper component to render the list of items using standard styling
const MealItems = ({ items }) => (
  <ul className="list-disc list-inside space-y-1 text-gray-600"> {/* Added space-y-1 */}
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

function StudentMessMenuPage() {
  const days = Object.keys(weeklyMenu);

  return (
    <div>
      {/* Restored Header Style */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Weekly Mess Menu</h1>

      <div className="space-y-6">
        {days.map(day => (
          // Restored Card Style
          <div key={day} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            {/* Restored Day Title Style */}
            <h2 className="text-2xl font-bold text-blue-600 mb-4">{day}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> {/* Increased gap */}
              <div>
                {/* Restored Meal Title Style */}
                <h3 className="font-semibold text-lg text-gray-700 mb-2 border-b pb-1">Breakfast</h3>
                <MealItems items={weeklyMenu[day].breakfast} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-700 mb-2 border-b pb-1">Lunch</h3>
                <MealItems items={weeklyMenu[day].lunch} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-700 mb-2 border-b pb-1">Snacks</h3>
                <MealItems items={weeklyMenu[day].snacks} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-700 mb-2 border-b pb-1">Dinner</h3>
                <MealItems items={weeklyMenu[day].dinner} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentMessMenuPage;