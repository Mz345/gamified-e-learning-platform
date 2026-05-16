import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/QuizMaster.css';

const QuizMaster = () => {
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');
  const [gameFinished, setGameFinished] = useState(false);
  const navigate = useNavigate();

  const subjectName = localStorage.getItem('subjectName') || 'General';

  const questionsData = {
    Math: [
      { question: 'Solve for x: 5x - 3 = 2x + 9', options: ['4', '3', '2', '5'], correctAnswer: '4' },
      { question: 'The sum of the interior angles of a triangle is:', options: ['180°', '360°', '90°', '270°'], correctAnswer: '180°' },
      { question: 'What is the square root of 144?', options: ['11', '13', '12', '14'], correctAnswer: '12' },
      { question: 'If the volume of a cube is 27 cm³, what is the length of one side?', options: ['3 cm', '9 cm', '6 cm', '27 cm'], correctAnswer: '3 cm' },
      { question: 'Which of the following is a perfect cube?', options: ['27', '16', '25', '18'], correctAnswer: '27' },
      { question: 'Find the ratio of 3 km to 300 m.', options: ['10:1', '1:10', '100:1', '1:100'], correctAnswer: '10:1' },
      { question: 'The total surface area of a cube with side 4 cm is:', options: ['96 cm²', '48 cm²', '64 cm²', '32 cm²'], correctAnswer: '96 cm²' },
      { question: 'What is 25% of 240?', options: ['60', '50', '75', '40'], correctAnswer: '60' },
      { question: 'The mean of the numbers 3, 7, 7, 19, 24 is:', options: ['12', '10', '14', '8'], correctAnswer: '12' },
      { question: 'What is the perimeter of a triangle with sides 7 cm, 8 cm and 9 cm?', options: ['24 cm', '22 cm', '23 cm', '20 cm'], correctAnswer: '24 cm' }

    ],
    Science: [
      { question: 'Which gas is necessary for combustion?', options: ['Nitrogen', 'Carbon dioxide', 'Oxygen', 'Hydrogen'], correctAnswer: 'Oxygen' },
      { question: 'Which part of the cell controls all its activities?', options: ['Cytoplasm', 'Nucleus', 'Cell wall', 'Chloroplast'], correctAnswer: 'Nucleus' },
      { question: 'Which of the following is a synthetic fiber?', options: ['Cotton', 'Wool', 'Polyester', 'Silk'], correctAnswer: 'Polyester' },
      { question: 'Which of these is an example of a chemical change?', options: ['Melting of ice', 'Boiling of water', 'Rusting of iron', 'Breaking of glass'], correctAnswer: 'Rusting of iron' },
      { question: 'What is the function of hemoglobin in our blood?', options: ['Fight infections', 'Provide immunity', 'Carry oxygen', 'Digest food'], correctAnswer: 'Carry oxygen' },
      { question: 'Which metal is the best conductor of electricity?', options: ['Iron', 'Copper', 'Silver', 'Aluminium'], correctAnswer: 'Silver' },
      { question: 'Which type of force is involved in magnetism?', options: ['Contact force', 'Gravitational force', 'Magnetic force', 'Frictional force'], correctAnswer: 'Magnetic force' },
      { question: 'What is the main function of the stomata in leaves?', options: ['Absorb nutrients', 'Store water', 'Exchange gases', 'Provide support'], correctAnswer: 'Exchange gases' },
      
      { question: 'What type of image is formed by a plane mirror?', options: ['Real and inverted', 'Real and upright', 'Virtual and inverted', 'Virtual and erect'], correctAnswer: 'Virtual and erect' },
      { question: 'Which part of the plant absorbs water and minerals?', options: ['Stem', 'Leaves', 'Roots', 'Flowers'], correctAnswer: 'Roots' }

    ],
    History: [
      { question: 'Who was the first Indian woman to win a Nobel Prize?', options: ['Mother Teresa', 'Sarojini Naidu', 'Indira Gandhi', 'Kiran Bedi'], correctAnswer: 'Mother Teresa' },
      { question: 'The famous “Kalinga War” was fought by which emperor?', options: ['Ashoka', 'Chandragupta Maurya', 'Samudragupta', 'Harsha'], correctAnswer: 'Ashoka' },
      { question: 'Who wrote the book “India Wins Freedom”?', options: ['Jawaharlal Nehru', 'Mahatma Gandhi', 'Subhash Chandra Bose', 'Sardar Patel'], correctAnswer: 'Subhash Chandra Bose' },
      { question: 'The “Battle of Plassey” was fought in which year?', options: ['1757', '1764', '1857', '1707'], correctAnswer: '1757' },
      { question: 'Who was the founder of the Mughal dynasty in India?', options: ['Babur', 'Akbar', 'Humayun', 'Shah Jahan'], correctAnswer: 'Babur' },
      { question: 'The famous “Jallianwala Bagh massacre” took place under which British General?', options: ['Reginald Dyer', 'Lord Curzon', 'Lord Dalhousie', 'Warren Hastings'], correctAnswer: 'Reginald Dyer' },
      { question: 'Which movement was launched by Mahatma Gandhi in 1930?', options: ['Civil Disobedience Movement', 'Non-Cooperation Movement', 'Quit India Movement', 'Swadeshi Movement'], correctAnswer: 'Civil Disobedience Movement' },
      { question: 'The “Quit India Movement” was launched in which year?', options: ['1942', '1930', '1919', '1920'], correctAnswer: '1942' },
      { question: 'Who was the first Governor-General of independent India?', options: ['Lord Mountbatten', 'C. Rajagopalachari', 'Jawaharlal Nehru', 'Rajendra Prasad'], correctAnswer: 'C. Rajagopalachari' },
      { question: 'The famous Indian leader who gave the slogan “Swaraj is my birthright” was?', options: ['Bal Gangadhar Tilak', 'Mahatma Gandhi', 'Jawaharlal Nehru', 'Subhash Chandra Bose'], correctAnswer: 'Bal Gangadhar Tilak' }

    ],

    English: [
      { question: 'In "The Hack Driver", who was the hack driver actually?', options: ['A real driver', 'A spy', 'The person being searched', 'A shopkeeper'], correctAnswer: 'The person being searched' },
      { question: 'Who wrote "The Browning Version"?', options: ['Douglas James', 'Terence Rattigan', 'Colin Dexter', 'Louis Fischer'], correctAnswer: 'Terence Rattigan' },
      { question: 'What does the fog compare to in Carl Sandburg’s poem "Fog"?', options: ['A thief', 'A dog', 'A cloud', 'A blanket'], correctAnswer: 'A cat' },
      { question: 'What is the poetic device in "The classroom is like a slum as big as doom"?', options: ['Simile', 'Personification', 'Alliteration', 'Metaphor'], correctAnswer: 'Simile' },
      { question: 'What does Mr. Lamb offer Derry in "On the Face of It"?', options: ['Chocolate', 'Friendship and hope', 'A mirror', 'A mask'], correctAnswer: 'Friendship and hope' },
      { question: 'What does the expression "stillness of the car" in "My Mother at Sixty-Six" signify?', options: ['Mechanical failure', 'End of the journey', 'Tension', 'Emotional silence'], correctAnswer: 'Emotional silence' },
      { question: 'What type of essay is "The Interview"?', options: ['Narrative', 'Descriptive', 'Expository', 'Analytical'], correctAnswer: 'Analytical' },
      { question: 'What lesson does William Douglas convey in "Deep Water"?', options: ['Avoid swimming', 'Face your fears', 'Trust no one', 'Be independent'], correctAnswer: 'Face your fears' },
      { question: 'What genre is the poem "Keeping Quiet"?', options: ['Romantic', 'Political', 'Philosophical', 'Descriptive'], correctAnswer: 'Philosophical' },
      { question: 'In "The Enemy", who is Dr. Sadao?', options: ['A soldier', 'A fisherman', 'A Japanese doctor', 'An American spy'], correctAnswer: 'A Japanese doctor' }
    ],

    Computer: [
      { question: 'What does CPU stand for?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Unit', 'Computer Processing Unit'], correctAnswer: 'Central Processing Unit' },
      { question: 'Which of the following is an input device?', options: ['Monitor', 'Keyboard', 'Printer', 'Speaker'], correctAnswer: 'Keyboard' },
      { question: 'What is the main function of an operating system?', options: ['Run applications', 'Manage hardware resources', 'Store data', 'Provide internet access'], correctAnswer: 'Manage hardware resources' },
      { question: 'Which language is primarily used for web development?', options: ['Python', 'JavaScript', 'C++', 'Java'], correctAnswer: 'JavaScript' },
      { question: 'What does HTML stand for?', options: ['HyperText Markup Language', 'HighText Markup Language', 'HyperText Machine Language', 'HighText Machine Language'], correctAnswer: 'HyperText Markup Language' },
      { question: 'Which of the following is a type of malware?', options: ['Antivirus', 'Firewall', 'Virus', 'Router'], correctAnswer: 'Virus' },
      { question: 'What is the purpose of a database?', options: ['Store and manage data', 'Display images', 'Run applications', 'Connect to the internet'], correctAnswer: 'Store and manage data' },
      { question: 'Which protocol is used for secure communication over the internet?', options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'], correctAnswer: 'HTTPS' },
      { question: 'What does GUI stand for in computing?', options: ['Graphical User Interface', 'General User Interface', 'Graphical Universal Interface', 'General Universal Interface'], correctAnswer: 'Graphical User Interface' },
      { question: "What is the primary function of RAM in a computer?", options: ['Store permanent data', 'Execute programs quickly', "Connect to external devices", "Display graphics"], correctAnswer: "Execute programs quickly" }
    ]
  };

  const questions = questionsData[subjectName] || questionsData['Math'];

  useEffect(() => {
    const id = localStorage.getItem('studentId');
    if (!id) {
      alert('You must be logged in to play the game.');
      navigate('/login');
      return;
    }
    setStudentId(id);
    setLoading(false);
  }, [navigate]);

  const handleAnswer = (selectedAnswer) => {
    if (!answered) {
      setSelectedOption(selectedAnswer);
      if (selectedAnswer === questions[questionIndex].correctAnswer) {
        setScore(prevScore => prevScore + 10);
      }
      setAnswered(true);
    }
  };

  const handleNext = () => {
    setSelectedOption('');
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(prevIndex => prevIndex + 1);
      setAnswered(false);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/leaderboard/update/${studentId}`, {
        subjectName,
        gameName: 'Quiz Master',
        score,
      });
      alert(response.data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting score');
    } finally {
      setGameFinished(true); // Show result screen regardless of score upload success
    }
  };

  const goToGameSelection = () => {
    navigate(`/game-selection/${subjectName.toLowerCase()}`)
  };

  if (loading) {
    return <div className="quizmaster-loading">Loading...</div>;
  }

  return (
    <div className="quizmaster-container">
      <div className="quizmaster-box">
        <h2 className="quizmaster-title">Quiz Master</h2>
        <p className="quizmaster-subject">Subject: {subjectName}</p>
        <p className="quizmaster-progress">Question {questionIndex + 1} of {questions.length}</p>

        {gameFinished ? (
          <>
            <p className="quizmaster-final-score">🎉 Quiz Completed!</p>
            <p className="quizmaster-score">Your Score: <strong>{score}</strong></p>
            <div className="quizmaster-controls">
              <button onClick={goToGameSelection} className="quizmaster-go-back-btn">
                Go Back to Game Selection
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="quizmaster-question">{questions[questionIndex].question}</p>
            <div className="quizmaster-options">
              {questions[questionIndex].options.map((option, index) => {
                let btnClass = 'quizmaster-option';
                if (answered) {
                  if (option === questions[questionIndex].correctAnswer) {
                    btnClass += ' correct';
                  } else if (option === selectedOption) {
                    btnClass += ' incorrect';
                  }
                }

                return (
                  <button
                    key={index}
                    className={btnClass}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="quizmaster-controls">
              {questionIndex < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!answered}
                  className="quizmaster-next-btn"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  disabled={!answered}
                  className="quizmaster-finish-btn"
                >
                  Finish Game
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizMaster;
