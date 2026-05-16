import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/TrueOrFalse.css';

const TrueOrFalse = () => {
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(10);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const [summary, setSummary] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);

  const navigate = useNavigate();

  const studentId = localStorage.getItem('studentId');
  const subjectName = localStorage.getItem('subjectName') || 'General';

  const questionsData = React.useMemo(() => ({
  Math: [
    { question: 'The graph of a linear equation in two variables is always a straight line.', answer: true },
    { question: 'The value of √2 is a rational number.', answer: false },
    { question: 'In a triangle, the sum of the lengths of any two sides is always greater than the third side.', answer: true },
    { question: 'The area of a parallelogram is base × height.', answer: true },
    { question: 'The degree of a constant polynomial is 1.', answer: false },
    { question: 'The diagonals of a rhombus bisect each other at right angles.', answer: true },
    { question: 'All circles are similar.', answer: true },
    { question: 'An irrational number can be expressed as a fraction.', answer: false },
    { question: 'A cube has 8 faces.', answer: false },
    { question: 'The probability of a certain event is 0.', answer: false }
  ],
  Science: [
    { question: 'Plasma is the fourth state of matter.', answer: true },
    { question: 'Isotopes have the same number of protons but different number of neutrons.', answer: true },
    { question: 'In plants, xylem transports food.', answer: false },
    { question: 'Mitochondria are called the powerhouse of the cell.', answer: true },
    { question: 'Newton’s First Law deals with acceleration.', answer: false },
    { question: 'Sound needs a medium to travel.', answer: true },
    { question: 'Evaporation causes cooling.', answer: true },
    { question: 'The smallest unit of an element is a molecule.', answer: false },
    { question: 'Electron has a positive charge.', answer: false },
    { question: 'Photosynthesis occurs in the mitochondria.', answer: false }
  ],
  History: [
    { question: 'The French Revolution began in 1789.', answer: true },
    { question: 'The Bastille was a prison in France.', answer: true },
    { question: 'Nazism rose in Italy under Hitler.', answer: false },
    { question: 'The Russian Revolution ended monarchy in Russia.', answer: true },
    { question: 'Karl Marx supported capitalism.', answer: false },
    { question: 'Mahatma Gandhi led the Salt March in 1930.', answer: true },
    { question: 'The Weimar Republic was formed in India.', answer: false },
    { question: 'The Treaty of Versailles punished Germany.', answer: true },
    { question: 'The Harappan Civilization used iron tools.', answer: false },
    { question: 'The Jacobins were radicals in the French Revolution.', answer: true }
  ],
  English: [
    { question: 'A clause always contains a finite verb.', answer: true },
    { question: 'Direct speech reports the exact words spoken.', answer: true },
    { question: 'In the sentence “He is running,” “is” is a main verb.', answer: false },
    { question: 'An autobiography is written by someone about someone else’s life.', answer: false },
    { question: 'A simile uses "like" or "as" to compare.', answer: true },
    { question: '“Had been working” is in past perfect tense.', answer: false },
    { question: 'Subject and verb must agree in number and person.', answer: true },
    { question: 'In “The Road Not Taken,” the poet is Robert Frost.', answer: true },
    { question: 'A gerund acts like a noun.', answer: true },
    { question: 'An essay is usually written in poetry form.', answer: false }
  ],
  Computer: [
    { question: 'An algorithm is a step-by-step procedure to solve a problem.', answer: true },
    { question: 'A flowchart is used to write executable code.', answer: false },
    { question: 'Secondary memory is non-volatile.', answer: true },
    { question: 'Boolean values can be either true or false.', answer: true },
    { question: 'In binary, 1 + 1 equals 2.', answer: false },
    { question: 'Compiler converts high-level language to machine code.', answer: true },
    { question: 'The operating system manages hardware and software resources.', answer: true },
    { question: 'Variables in programming must start with a number.', answer: false },
    { question: 'HTML is used to style a webpage.', answer: false },
    { question: 'RAM stores data permanently.', answer: false }
  ]
}), []);


  const shuffleArray = (arr) => {
    return arr.sort(() => Math.random() - 0.5);
  };

  const checkIfPlayed = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/leaderboard/check/${studentId}`, {
        params: { subjectName, gameName: 'True or False' },
      });
      setAlreadyPlayed(res.data.alreadyPlayed);
    } catch (err) {
      console.error('Check already played failed:', err);
    }
  }, [studentId, subjectName]);

  useEffect(() => {
    const selected = [...(questionsData[subjectName] || questionsData['Math'])];
    setQuestions(shuffleArray(selected));
    checkIfPlayed();
  }, [questionsData, subjectName, checkIfPlayed]);

  const handleAnswer = useCallback((userAnswer) => {
    if (answered || gameFinished) return;

    const current = questions[questionIndex];
    const isCorrect = userAnswer === current.answer;

    if (isCorrect) {
      const bonus = timeLeft >= 7 ? 5 : 0;
      setScore((prev) => prev + 10 + bonus);
      setFeedback(`✅ Correct! +${10 + bonus}`);
    } else {
      setFeedback(`❌ Incorrect. Correct answer: ${current.answer ? 'True' : 'False'}`);
    }

    setSummary((prev) => [
      ...prev,
      {
        question: current.question,
        yourAnswer: userAnswer,
        correct: isCorrect,
        correctAnswer: current.answer,
        timeUsed: 10 - timeLeft,
      },
    ]);

    setAnswered(true);
    setTimeout(() => {
      setFeedback('');
      if (questionIndex < questions.length - 1) {
        setQuestionIndex((prev) => prev + 1);
        setAnswered(false);
        setTimeLeft(10);
      } else {
        setGameFinished(true);
      }
    }, 2000);
  }, [answered, gameFinished, questions, questionIndex, timeLeft]);

  useEffect(() => {
    if (answered || gameFinished) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          handleAnswer(null);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [questionIndex, answered, gameFinished, handleAnswer]);

  const handleFinish = async () => {
    if (!studentId) {
      alert('Student ID missing. Please login again.');
      return;
    }

    if (alreadyPlayed) {
      alert('You already played this game.');
      return;
    }

    try {
      const res = await axios.put(`http://localhost:5000/api/leaderboard/update/${studentId}`, {
        subjectName,
        gameName: 'True or False',
        score,
      });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting score');
    }
  };

  const handleGoBack = () => {
    navigate(`/game-selection/${subjectName.toLowerCase()}`); // Adjust route as per your app
  };

  if (questions.length === 0) return <p>Loading questions...</p>;

  return (
    <div className="truefalse-container">
      <div className="truefalse-box">
        <h2>True or False Game</h2>
        <p className="truefalse-subject">Subject: {subjectName}</p>

        {gameFinished ? (
          <>
            <h3>Game Over! 🎉</h3>
            <p>Total Score: {score}</p>
            <ul className="summary-list">
              {summary.map((s, i) => (
                <li key={i}>
                  <strong>Q:</strong> {s.question} <br />
                  <strong>Your Answer:</strong> {String(s.yourAnswer)} |{' '}
                  <strong>Correct:</strong> {String(s.correctAnswer)} |{' '}
                  <strong>Time:</strong> {s.timeUsed}s
                </li>
              ))}
            </ul>
            <button onClick={handleFinish} className="finish-button">Submit to Leaderboard</button>
            <button onClick={handleGoBack} className="goback-button">Go Back</button>
          </>
        ) : (
          <>
            <p className="truefalse-question">{questions[questionIndex].question}</p>
            <div className="truefalse-buttons">
              <button onClick={() => handleAnswer(true)} disabled={answered}>True</button>
              <button onClick={() => handleAnswer(false)} disabled={answered}>False</button>
            </div>
            <p className="timer">⏳ Time Left: {timeLeft}s</p>
            {feedback && <p className="feedback">{feedback}</p>}
            {/* No Go Back button here */}
          </>
        )}
      </div>
    </div>
  );
};

export default TrueOrFalse;
