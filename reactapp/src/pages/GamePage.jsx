import React from 'react';
import { useParams } from 'react-router-dom';
import QuizMaster from '../games/QuizMaster';
import FlashCards from '../games/FlashCards'; // Assuming you have this component
import TrueOrFalse from '../games/TrueOrFalse'; // Assuming you have this component
import FillInTheBlanks from '../games/FillInTheBlanks'; // Assuming you have this component

const GamePage = () => {
  const { subject, game } = useParams();

  const renderGame = () => {
    switch (game) {
      case 'quiz-master':
        return <QuizMaster />;
      case 'fill-in-the-blanks':
        return <FillInTheBlanks subject={subject} />;
      case 'flash-cards':
        return <FlashCards subject={subject} />;
      case 'true-or-false':
        return <TrueOrFalse subject={subject} />;
      default:
        return <div>Game not found</div>;
    }
  };

  return (
    <div className="game-page">
      {renderGame()}
    </div>
  );
};

export default GamePage;
