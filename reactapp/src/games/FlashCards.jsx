// src/games/FlashCard.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/FlashCard.css';

// Levenshtein distance function (unchanged)
function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1].toLowerCase() === b[j - 1].toLowerCase()) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + 1
        );
      }
    }
  }
  return matrix[a.length][b.length];
}

function isCloseEnough(userAnswer, correctAnswer) {
  const distance = levenshtein(
    userAnswer.trim().toLowerCase(),
    correctAnswer.trim().toLowerCase()
  );
  return distance > 0 && distance <= 2;
}

const FlashCard = () => {
  const [index, setIndex] = useState(0);
  const [inputAnswer, setInputAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [timer, setTimer] = useState(30);
  const [stats, setStats] = useState({ right: 0, wrong: 0, skipped: 0 });
  const [feedback, setFeedback] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [hintVisible, setHintVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const studentId = localStorage.getItem('studentId');
  const subjectName = localStorage.getItem('subjectName') || 'General';

  const navigate = useNavigate();

  const flashcardsData = {
  General: [
    { question: 'Capital of France?', answer: 'Paris', hint: 'It is also called the city of lights.' },
    { question: 'Water boils at ____ degrees Celsius.', answer: '100', hint: 'It’s a 3-digit number.' },
    { question: 'Largest planet in our Solar System?', answer: 'Jupiter', hint: 'Named after the king of the gods.' },
    { question: 'Who wrote "Romeo and Juliet"?', answer: 'William Shakespeare', hint: 'Famous English playwright.' },
    { question: 'What gas do plants absorb?', answer: 'Carbon Dioxide', hint: 'It contains carbon and oxygen.' },
    { question: 'National animal of India?', answer: 'Tiger', hint: 'Big striped cat.' },
    { question: 'Fastest land animal?', answer: 'Cheetah', hint: 'Spotted predator.' },
    { question: 'Which planet is known as the Red Planet?', answer: 'Mars', hint: 'Named after Roman god of war.' },
    { question: 'Primary language spoken in Brazil?', answer: 'Portuguese', hint: 'Not Spanish.' },
    { question: 'Which organ pumps blood?', answer: 'Heart', hint: 'Beats continuously.' }
  ],
  Maths: [
    { question: 'Square root of 81?', answer: '9', hint: 'A single-digit number.' },
    { question: 'Area of a circle formula?', answer: 'πr²', hint: 'Involves pi and radius.' },
    { question: 'What is 5 × 6?', answer: '30', hint: 'Less than 40.' },
    { question: 'Value of π rounded?', answer: '3.14', hint: 'Starts with 3.' },
    { question: 'What is 10²?', answer: '100', hint: 'Two zeroes.' },
    { question: 'Triangle with all equal sides?', answer: 'Equilateral', hint: 'All angles are 60°.' },
    { question: 'Sum of angles in a triangle?', answer: '180', hint: 'Multiple of 60.' },
    { question: 'HCF stands for?', answer: 'Highest Common Factor', hint: 'Used in factorization.' },
    { question: 'What is the cube of 3?', answer: '27', hint: '3 × 3 × 3' },
    { question: 'What’s the result of 0 × any number?', answer: '0', hint: 'Multiplication rule.' }
  ],
  Science: [
    { question: 'Chemical formula of water?', answer: 'H2O', hint: '2 hydrogens, 1 oxygen.' },
    { question: 'Basic unit of life?', answer: 'Cell', hint: 'Tiny building block.' },
    { question: 'Force is measured in?', answer: 'Newton', hint: 'Named after a scientist.' },
    { question: 'Green pigment in plants?', answer: 'Chlorophyll', hint: 'Essential for photosynthesis.' },
    { question: 'Planet with rings?', answer: 'Saturn', hint: 'Second largest planet.' },
    { question: 'What organ helps you breathe?', answer: 'Lungs', hint: 'There are two of them.' },
    { question: 'Friction is a ____ force.', answer: 'Contact', hint: 'Objects must touch.' },
    { question: 'Sound travels fastest in?', answer: 'Solids', hint: 'Particles are tightly packed.' },
    { question: 'Rusting requires ____ and water.', answer: 'Oxygen', hint: 'Gas in air.' },
    { question: 'SI unit of mass?', answer: 'Kilogram', hint: 'Starts with K.' }
  ],
  History: [
    { question: 'First President of the USA?', answer: 'George Washington', hint: 'A founding father.' },
    { question: 'Renaissance began in?', answer: 'Italy', hint: 'Famous for Rome.' },
    { question: 'World War I began in?', answer: '1914', hint: 'Early 20th century.' },
    { question: 'Fall of Berlin Wall?', answer: '1989', hint: 'End of Cold War era.' },
    { question: 'Father of the Nation (India)?', answer: 'Mahatma Gandhi', hint: 'Leader of non-violence.' },
    { question: 'Capital of Mauryan Empire?', answer: 'Pataliputra', hint: 'Ancient Indian city.' },
    { question: 'Battle of Plassey year?', answer: '1757', hint: 'Mid-18th century.' },
    { question: 'Dandi March opposed the ____ law.', answer: 'Salt', hint: 'Essential mineral.' },
    { question: 'Revolutionary who said "Give me blood..."?', answer: 'Subhas Chandra Bose', hint: 'INA leader.' },
    { question: 'Incident after which Non-Cooperation ended?', answer: 'Chauri Chaura', hint: 'Police station burned.' }
  ],
  Computer: [
    { question: 'Full form of CPU?', answer: 'Central Processing Unit', hint: 'Brain of the computer.' },
    { question: 'HTML is used for?', answer: 'Web pages', hint: 'Web design language.' },
    { question: 'Shortcut for Copy?', answer: 'Ctrl + C', hint: 'Common keyboard shortcut.' },
    { question: 'Permanent memory in computer?', answer: 'ROM', hint: 'Non-volatile.' },
    { question: 'Temporary memory?', answer: 'RAM', hint: 'Volatile memory.' },
    { question: 'What is Malware?', answer: 'Malicious Software', hint: 'Includes viruses.' },
    { question: 'Spreadsheet software example?', answer: 'Excel', hint: 'Made by Microsoft.' },
    { question: 'Language used in websites?', answer: 'HTML', hint: 'HyperText based.' },
    { question: 'Email stands for?', answer: 'Electronic Mail', hint: 'Communication method.' },
    { question: 'Software controlling hardware?', answer: 'Operating System', hint: 'Examples: Windows, Linux.' }
  ],
  English: [
    { question: 'Plural of child?', answer: 'Children', hint: 'Irregular plural.' },
    { question: 'Past tense of go?', answer: 'Went', hint: 'Not "goed".' },
    { question: 'Synonym of happy?', answer: 'Joyful', hint: 'Also means cheerful.' },
    { question: 'Antonym of honest?', answer: 'Dishonest', hint: 'Starts with "dis-".' },
    { question: '“He is playing” tense?', answer: 'Present Continuous', hint: 'Is + verb+ing' },
    { question: '“Beautiful” is a ____?', answer: 'Adjective', hint: 'Describes a noun.' },
    { question: '“He is as brave as a lion” is a?', answer: 'Simile', hint: 'Comparison using "as".' },
    { question: 'Opposite of strong?', answer: 'Weak', hint: 'Lack of strength.' },
    { question: '“Kill two birds with one stone” is a?', answer: 'Proverb', hint: 'A wise saying.' },
    { question: 'Word that names a person/place/thing?', answer: 'Noun', hint: 'Basic part of speech.' }
  ]
};

  const flashcards = flashcardsData[subjectName] || flashcardsData['General'];
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  const moveNextCard = useCallback(() => {
    setFeedback(null);
    setInputAnswer('');
    setAttempts(0);
    setHintVisible(false);
    if (index < flashcards.length - 1) {
      setIndex(prev => prev + 1);
    } else {
      setCompleted(true);
    }
  }, [index, flashcards.length]);

  const handleSkip = useCallback(() => {
    setStats(prev => ({ ...prev, skipped: prev.skipped + 1 }));
    setFeedback(null);
    clearInterval(timerRef.current);
    moveNextCard();
  }, [moveNextCard]);

  useEffect(() => {
    if (completed) return;
    setTimer(30);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSkip();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [index, completed, handleSkip]);

  useEffect(() => {
    if (inputRef.current && !completed) {
      inputRef.current.focus();
    }
  }, [index, completed]);

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (attempts >= 3 || !inputAnswer.trim() || timer === 0) return;

    const currentCard = flashcards[index];
    if (!currentCard) return;

    const correctAnswer = currentCard.answer.trim();
    const userAnswer = inputAnswer.trim();

    clearInterval(timerRef.current);

    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      setFeedback('correct');
      setScore(prev => prev + 10);
      setStats(prev => ({ ...prev, right: prev.right + 1 }));
      setTimeout(moveNextCard, 1500);
    } else if (isCloseEnough(userAnswer, correctAnswer)) {
      setFeedback('almost');
      setAttempts(prev => prev + 1);
      setTimer(10);
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSkip();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setFeedback('wrong');
      setAttempts(prev => prev + 1);
      if (attempts + 1 >= 3) {
        setStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));
        setTimeout(moveNextCard, 1500);
      } else {
        setTimer(10);
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setTimer(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              handleSkip();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
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
          gameName: 'Flashcard',
          score,
        }
      );
      alert(response.data.message);
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting score');
    }
  };

  const currentCard = flashcards[index];
  if (!currentCard && !completed) {
    return <div className="flashcard-game-container"><h3>Loading...</h3></div>;
  }

  if (completed) {
    return (
      <div className="flashcard-fullscreen-wrapper">
        <div className="flashcard-game-container">
          <h2>Flashcard Game Complete</h2>
          <p><strong>Your Score:</strong> {score}</p>
          <p>Right answers: {stats.right}</p>
          <p>Wrong answers: {stats.wrong}</p>
          <p>Skipped questions: {stats.skipped}</p>

          {/* Show Submit Score button only if not submitted */}
          {!submitted && (
            <button className="flashcard-btn-primary" onClick={handleFinish}>
              Submit Score
            </button>
          )}

          {/* Always show Go Back button when completed */}
          <button
            className="flashcard-btn-secondary"
            onClick={() => navigate(`/game-selection/${subjectName.toLowerCase()}`)}
            style={{ marginTop: '10px' }}
          >
            Go Back to Game Selection
          </button>
        </div>
      </div>
    );
  }

  const progress = (index / flashcards.length) * 100;
  let bgColor = '#1e293b';
  if (feedback === 'correct') bgColor = '#14532d';
  else if (feedback === 'wrong') bgColor = '#7f1d1d';
  else if (feedback === 'almost') bgColor = '#78350f';

  return (
    <div className="flashcard-game-container">
      <h2>Flashcard Game</h2>
      <p>Subject: {subjectName}</p>
      <p>Score: {score}</p>

      <div className="flashcard-progress-bar-outer">
        <div className="flashcard-progress-bar-inner" style={{ width: `${progress}%` }} />
      </div>

      <div className="flashcard-box" style={{ backgroundColor: bgColor }}>
        {currentCard.question}
      </div>

      <form onSubmit={handleAnswerSubmit}>
        <input
          type="text"
          ref={inputRef}
          value={inputAnswer}
          onChange={e => setInputAnswer(e.target.value)}
          placeholder="Type your answer here..."
          disabled={feedback === 'correct' || attempts >= 3 || timer === 0}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={
            inputAnswer.trim() === '' ||
            feedback === 'correct' ||
            attempts >= 3 ||
            timer === 0
          }
        >
          Submit
        </button>
      </form>

      <div className="flashcard-feedback-text">
        {feedback === 'correct' && 'Correct! 🎉'}
        {feedback === 'almost' && 'Almost correct, try again!'}
        {feedback === 'wrong' && attempts < 3 && 'Wrong answer, try again!'}
        {feedback === 'wrong' && attempts >= 3 && 'No attempts left! Moving on...'}
      </div>

      <button
        className="flashcard-btn-secondary"
        onClick={() => setHintVisible(!hintVisible)}
      >
        {hintVisible ? 'Hide Hint' : 'Show Hint'}
      </button>

      {hintVisible && <div className="flashcard-hint-box">Hint: {currentCard.hint}</div>}

      <div className="flashcard-timer-text">Time left: <b>{timer}s</b></div>
    </div>
  );
};

export default FlashCard;
