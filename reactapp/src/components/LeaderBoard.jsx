import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../styles/Leaderboard.css";

const Leaderboard = () => {
  const [students, setStudents] = useState([]);
  const [range, setRange] = useState('daily'); // 'daily', 'weekly', 'monthly'

  const fetchLeaderboard = React.useCallback(async (selectedRange = range) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/leaderboard?range=${selectedRange}`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard', error);
    }
  }, [range]);

  useEffect(() => {
    fetchLeaderboard();

    const interval = setInterval(() => fetchLeaderboard(), 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  const handleRangeChange = (newRange) => {
    setRange(newRange);
    fetchLeaderboard(newRange);
  };

  return (
    <div className="leaderboard-container">
      <h1>🏆 Leaderboard</h1>

      {/* Range Toggle Buttons */}
      <div className="range-buttons">
        <button 
          className={range === 'daily' ? 'active' : ''} 
          onClick={() => handleRangeChange('daily')}
        >
          Daily
        </button>
        <button 
          className={range === 'weekly' ? 'active' : ''} 
          onClick={() => handleRangeChange('weekly')}
        >
          Weekly
        </button>
        <button 
          className={range === 'monthly' ? 'active' : ''} 
          onClick={() => handleRangeChange('monthly')}
        >
          Monthly
        </button>
      </div>

      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={`${student.name}-${index}`}>
              <td>{index + 1}</td>
              <td>{student.name}</td>
              <td>{student.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
