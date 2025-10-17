// src/pages/StudentMessMenuPage.jsx

import React from 'react';
import { weeklyMenu } from '../data/menuData';

// A small component to render the list of items
const MealItems = ({ items }) => (
  <ul className="list-disc list-inside text-gray-600">
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

function StudentMessMenuPage() {
  const days = Object.keys(weeklyMenu);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Weekly Mess Menu</h1>
      <div className="space-y-6">
        {days.map(day => (
          <div key={day} className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">{day}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 text-lg mb-2">Breakfast</h3>
                <MealItems items={weeklyMenu[day].breakfast} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 text-lg mb-2">Lunch</h3>
                <MealItems items={weeklyMenu[day].lunch} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 text-lg mb-2">Snacks</h3>
                <MealItems items={weeklyMenu[day].snacks} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 text-lg mb-2">Dinner</h3>
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