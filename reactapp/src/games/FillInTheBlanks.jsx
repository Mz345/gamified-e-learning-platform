import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/FillInTheBlanks.css';

const FillInTheBlank = () => {
  const navigate = useNavigate();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [usedOptions, setUsedOptions] = useState([]);
  const [lastDragOption, setLastDragOption] = useState(null);

  const studentId = localStorage.getItem('studentId');
  const subjectName = localStorage.getItem('subjectName') || 'General';

  const questionsData = {
  Maths: [
    { sentence: 'The value of π is approximately ____.', correctAnswer: '3.14', options: ['3.14', '22'] },
    { sentence: 'The square root of 144 is ____.', correctAnswer: '12', options: ['11', '12'] },
    { sentence: 'A triangle with all sides equal is called ____.', correctAnswer: 'Equilateral', options: ['Scalene', 'Equilateral'] },
    { sentence: 'The perimeter of a square is 4 × ____.', correctAnswer: 'side', options: ['radius', 'side'] },
    { sentence: 'The area of a circle is π × ____².', correctAnswer: 'radius', options: ['diameter', 'radius'] },
    { sentence: 'A linear equation in two variables is written as ax + by = ____.', correctAnswer: 'c', options: ['ab', 'c'] },
    { sentence: 'The HCF of two numbers is the ____.', correctAnswer: 'greatest common factor', options: ['lowest common multiple', 'greatest common factor'] },
    { sentence: 'The sum of the angles in a triangle is ____ degrees.', correctAnswer: '180', options: ['90', '180'] },
    { sentence: 'The cube of 3 is ____.', correctAnswer: '27', options: ['9', '27'] },
    { sentence: 'If a × b = 0, then either a = 0 or b = ____.', correctAnswer: '0', options: ['1', '0'] }
  ],
  Science: [
    { sentence: 'The unit of force is ____.', correctAnswer: 'Newton', options: ['Joule', 'Newton'] },
    { sentence: 'The gas used in photosynthesis is ____.', correctAnswer: 'Carbon dioxide', options: ['Oxygen', 'Carbon dioxide'] },
    { sentence: 'The basic unit of life is ____.', correctAnswer: 'Cell', options: ['Tissue', 'Cell'] },
    { sentence: 'The chemical formula of water is ____.', correctAnswer: 'H2O', options: ['H2O', 'CO2'] },
    { sentence: 'The organ that pumps blood is the ____.', correctAnswer: 'heart', options: ['brain', 'heart'] },
    { sentence: 'Friction is a type of ____ force.', correctAnswer: 'contact', options: ['contact', 'non-contact'] },
    { sentence: 'Sound travels fastest in ____.', correctAnswer: 'solids', options: ['air', 'solids'] },
    { sentence: 'Photosynthesis occurs in the ____ of the plant cell.', correctAnswer: 'chloroplast', options: ['nucleus', 'chloroplast'] },
    { sentence: 'Iron reacts with oxygen and water to form ____.', correctAnswer: 'rust', options: ['salt', 'rust'] },
    { sentence: 'The S.I. unit of mass is ____.', correctAnswer: 'kilogram', options: ['gram', 'kilogram'] }
  ],
  History: [
    { sentence: 'The first President of the USA was ____.', correctAnswer: 'George Washington', options: ['Abraham Lincoln', 'George Washington'] },
    { sentence: 'The ancient civilization of Egypt is known for its ____.', correctAnswer: 'pyramids', options: ['temples', 'pyramids'] },
    { sentence: 'The Renaissance began in ____.', correctAnswer: 'Italy', options: ['France', 'Italy'] },
    { sentence: 'World War I started in the year ____.', correctAnswer: '1914', options: ['1912', '1914'] },
    { sentence: 'The Berlin Wall fell in the year ____.', correctAnswer: '1989', options: ['1990', '1989'] },
    { sentence: 'The capital of the Mauryan Empire was ____.', correctAnswer: 'Pataliputra', options: ['Delhi', 'Pataliputra'] },
    { sentence: 'The Dandi March was started to protest against ____.', correctAnswer: 'Salt law', options: ['Tax', 'Salt law'] },
    { sentence: 'The battle of Plassey was fought in ____.', correctAnswer: '1757', options: ['1857', '1757'] },
    { sentence: 'The non-cooperation movement was withdrawn after the ____ incident.', correctAnswer: 'Chauri Chaura', options: ['Jallianwala Bagh', 'Chauri Chaura'] },
    { sentence: 'Subhas Chandra Bose formed the ____ Army.', correctAnswer: 'Indian National', options: ['Azad Hind', 'Indian National'] }
  ],
  Computer: [
    { sentence: 'The full form of CPU is ____.', correctAnswer: 'Central Processing Unit', options: ['Central Processing Unit', 'Computer Power Unit'] },
    { sentence: 'HTML is used to design ____.', correctAnswer: 'Web pages', options: ['Mobile apps', 'Web pages'] },
    { sentence: 'A computer virus is a type of ____.', correctAnswer: 'Malware', options: ['Hardware', 'Malware'] },
    { sentence: 'The shortcut for copy is Ctrl + ____.', correctAnswer: 'C', options: ['C', 'X'] },
    { sentence: 'A ____ is a permanent memory in a computer.', correctAnswer: 'ROM', options: ['RAM', 'ROM'] },
    { sentence: 'Data is stored in rows and columns in ____.', correctAnswer: 'Spreadsheet', options: ['Browser', 'Spreadsheet'] },
    { sentence: 'The language used for structuring web pages is ____.', correctAnswer: 'HTML', options: ['Python', 'HTML'] },
    { sentence: 'The brain of the computer is the ____.', correctAnswer: 'CPU', options: ['Monitor', 'CPU'] },
    { sentence: 'Email stands for ____.', correctAnswer: 'Electronic mail', options: ['Express mail', 'Electronic mail'] },
    { sentence: 'Software that controls hardware is called ____.', correctAnswer: 'Operating System', options: ['Application', 'Operating System'] }
  ],
  English: [
    { sentence: 'A synonym of “happy” is ____.', correctAnswer: 'joyful', options: ['sad', 'joyful'] },
    { sentence: 'An antonym of “honest” is ____.', correctAnswer: 'dishonest', options: ['true', 'dishonest'] },
    { sentence: 'The plural of “child” is ____.', correctAnswer: 'children', options: ['childs', 'children'] },
    { sentence: '“He ____ playing football.” (use present continuous)', correctAnswer: 'is', options: ['was', 'is'] },
    { sentence: 'A noun is a name of a person, place or ____.', correctAnswer: 'thing', options: ['adjective', 'thing'] },
    { sentence: '“She has a beautiful voice.” – Here, “beautiful” is a ____.', correctAnswer: 'adjective', options: ['noun', 'adjective'] },
    { sentence: 'The past tense of “go” is ____.', correctAnswer: 'went', options: ['gone', 'went'] },
    { sentence: '“He is as brave as a lion.” – This is a ____.', correctAnswer: 'simile', options: ['metaphor', 'simile'] },
    { sentence: '“To kill two birds with one stone” is a ____.', correctAnswer: 'proverb', options: ['verb', 'proverb'] },
    { sentence: 'The opposite of “strong” is ____.', correctAnswer: 'weak', options: ['hard', 'weak'] }
  ]
};

  const questions = questionsData[subjectName] || questionsData['General'];
  const allOptions = Array.from(
    new Set(questions.flatMap(q => q.options))
  ).filter(opt => !usedOptions.includes(opt));

  const handleDragStart = (e, option) => {
    setLastDragOption(option);
    e.dataTransfer.setData('text/plain', option);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedOption = e.dataTransfer.getData('text/plain');
    const correctAnswer = questions[questionIndex].correctAnswer;

    if (droppedOption === correctAnswer) {
      setScore(prev => prev + 10);
      setUsedOptions(prev => [...prev, droppedOption]);
    }
    setAnswered(true);
  };

  const handleNext = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(prev => prev + 1);
      setAnswered(false);
      setLastDragOption(null);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    if (!studentId) {
      alert('Student ID missing. Please login again.');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/leaderboard/update/${studentId}`,
        {
          subjectName,
          gameName: 'Fill in the Blank',
          score,
        }
      );
      alert(response.data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting score');
    }
  };

  return (
    <div className="fib-game-container">
      <h2 className="fib-title">Fill in the Blank</h2>
      <p>Subject: <strong>{subjectName}</strong></p>
      <p>Score: <strong>{score}</strong></p>

      <div className="fib-sentence">
        {(() => {
          const parts = questions[questionIndex].sentence.split('____');
          return (
            <>
              {parts[0]}
              <span
                className={`fib-drop-zone ${
                  answered
                    ? lastDragOption === questions[questionIndex].correctAnswer
                      ? 'fib-correct'
                      : 'fib-incorrect'
                    : ''
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                {answered ? lastDragOption : 'Drop Here'}
              </span>
              {parts[1]}
            </>
          );
        })()}
      </div>

      <div className="fib-options-box">
        <h4>Choose the correct answer:</h4>
        <div className="fib-options-container">
          {allOptions.length === 0 && <i>No more options left</i>}
          {allOptions.map((option, idx) => (
            <div
              key={idx}
              className="fib-option"
              draggable={!answered}
              onDragStart={(e) => handleDragStart(e, option)}
            >
              {option}
            </div>
          ))}
        </div>
      </div>

      <div className="fib-button-group">
        {answered ? (
          questionIndex < questions.length - 1 ? (
            <button onClick={handleNext}>Next</button>
          ) : (
            <button onClick={handleFinish}>Submit Score</button>
          )
        ) : (
          <button disabled>Drop an answer to continue</button>
        )}
      </div>

      {answered && questionIndex === questions.length - 1 && (
        <div className="fib-back-button">
          <button
            onClick={() => navigate(`/game-selection/${subjectName.toLowerCase()}`)}
          >
            ⬅ Back to Game Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default FillInTheBlank;
