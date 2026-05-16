import { useNavigate, useParams } from 'react-router-dom';
import '../styles/GameSelectionPage.css';

const subjectDetails = {
  maths: {
    name: 'Maths',
    description: 'Sharpen your calculation and problem-solving skills.',
    icon: '📐'
  },
  science: {
    name: 'Science',
    description: 'Explore the world of experiments and discoveries.',
    icon: '🔬'
  },
  history: {
    name: 'History',
    description: 'Travel back in time and test your knowledge of the past.',
    icon: '📜'
  },
  computer: {
    name: 'Computer',
    description: 'Understand computing logic, software, and technology.',
    icon: '💻'
  },
  english: {
    name: 'English',
    description: 'Improve your grammar, vocabulary and comprehension.',
    icon: '📚'
  }
};

const games = [
  { name: 'Quiz Master', icon: '❓' },
  { name: 'Fill In The Blanks', icon: '🧩' },
  { name: 'Flash Cards', icon: '📇' },
  { name: 'True or False', icon: '✅❌' },
];

const GameSelection = () => {
  const { subject } = useParams();
  const navigate = useNavigate();
  const subjectInfo = subjectDetails[subject];

  const handleBackToLeaderboard = () => navigate('/leaderboard');
  const handleBackToHome = () => {
    const role = localStorage.getItem('role');
    navigate(role === "teacher" ? "/teacherhome" : "/studenthome");
  };
  const handleGameClick = (game) => {
    navigate(`/game-play/${subject}/${game.toLowerCase().replace(/\s/g, '-')}`);
  };

  return (
    <div className="game-selection-page">
      <div className="game-selection-container">

        <div className="top-buttons">
          <button className="back-button" onClick={handleBackToLeaderboard}>LEADERBOARD</button>
          <button className="back-button" onClick={handleBackToHome}>HOME</button>
        </div>

        <div className="subject-banner">
          <h2>{subjectInfo?.icon} {subjectInfo?.name}</h2>
          <p>{subjectInfo?.description}</p>
        </div>

        <h3 className="game-selection-heading">Choose a Game</h3>
        <div className="game-card-wrapper">
          {games.map((game, index) => (
            <div className="game-card" key={index} onClick={() => handleGameClick(game.name)}>
              <div className="game-icon">{game.icon}</div>
              <div className="game-name">{game.name}</div>
            </div>
          ))}
        </div>

        <div className="tips-section">
          <h4>📌 Tips</h4>
          <ul>
            <li>Each game helps reinforce different concepts.</li>
            <li>Earn points only on the first attempt of each game (unless reissued by the teacher).</li>
            <li>Leaderboard ranks you based on performance and consistency.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GameSelection;
