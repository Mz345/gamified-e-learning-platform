import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SubjectCard.css';

const SubjectCard = ({ subject }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Store the subject name, not id
    localStorage.setItem('subjectName', subject.name); // Storing 'name' instead of 'id'
    navigate(`/game-selection/${subject.name.toLowerCase()}`); // Ensure route uses subject name
  };

  return (
    <div className="subject-card" onClick={handleClick}>
      <div className="subject-icon">{subject.icon}</div>
      <div className="subject-name">{subject.name}</div>
    </div>
  );
};

export default SubjectCard;
