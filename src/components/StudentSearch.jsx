// src/components/StudentSearch.jsx

import React, { useState, useEffect } from 'react';

function StudentSearch({ students, onSelectStudent }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(query.toLowerCase()) ||
        student.roll_no.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query, students]);

  const handleSelect = (student) => {
    setQuery(`${student.name} (${student.roll_no})`);
    onSelectStudent(student.id);
    setResults([]); // Hide results after selection
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search student by name or roll no..."
        className="w-full max-w-xs p-2 border rounded-md"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 w-full max-w-xs bg-white border rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
          {results.map(student => (
            <li
              key={student.id}
              onClick={() => handleSelect(student)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {student.name} ({student.roll_no})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StudentSearch;