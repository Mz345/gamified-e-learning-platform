import React from 'react';
import { Link } from 'react-router-dom';
import SubjectCard from '../components/SubjectCard';
import '../styles/HomePage.css';

const subjects = [
  { id: 'maths', name: 'Maths', icon: '📐' },
  { id: 'science', name: 'Science', icon: '🔬' },
  { id: 'history', name: 'History', icon: '📜' },
  { id: 'computer', name: 'Computer', icon: '💻' },
  { id: 'english', name: 'English', icon: '📚' }
];

const StudentHome = () => {
  return (
    <div className="home-wrapper">
      {/* Logo placed separately and floated to top right */}
      <img src="../asset/logo.jpg" alt="Logo" className="floating-logo" />

      <main className="home-container">
        {/* Header (without logo) */}
        <header className="home-header">
          <div className="header-left">
            <Link to="/leaderboard" className="leaderboard-btn">
              🏆 Leaderboard
            </Link>
          </div>
          <div className="header-right">
            <h1>LevelUpAcademy</h1>
          </div>
        </header>

  

        {/* Subjects container */}
        <section className="subjects-container">
          {subjects.map((subject) => (
            <SubjectCard key={subject.name} subject={subject} />
          ))}
        </section>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-left">
              <h3>LevelUpAcademy</h3>
              <p>Empowering students through gamified learning.</p>
            </div>
            <div className="footer-right">
              <ul>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/settings">Settings</Link></li>
                <li><Link to="/leaderboard">Leaderboard</Link></li>
              </ul>
            </div>
          </div>
            <div className="footer-bottom">
              &copy; {new Date().getFullYear()} LevelUpAcademy. All rights reserved.
            </div>
        </footer>
      </main>
    </div>
  );
};

export default StudentHome;
