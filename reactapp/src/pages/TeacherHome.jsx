import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/TeacherHomePage.css';

const TeacherHome = () => {
  const navigate = useNavigate();

  // Handlers to navigate to respective pages
  const handleReissueClick =  (subjectId) => {
    navigate(`/teacher/reissue/${subjectId}`);
  };

  

  return (
    <div className="home-wrapper">
      <img src="../asset/logo.jpg" alt="Logo" className="floating-logo" />

      <div className="page-container">
        <main className="home-container">
          <header className="home-header">
            <div className="header-left">
              <Link to="/leaderboard" className="leaderboard-btn">
                🏆 View Leaderboard
              </Link>
            </div>
            <div className="header-right">
              <h1>LevelUpAcademy - Teacher Panel</h1>
            </div>
          </header>

          <section className="subjects-container" style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
            <div
              className="subject-card"
              onClick={handleReissueClick}
              style={{ cursor: 'pointer', width: '500px', textAlign: 'center' }}
            >
              <div className="t-icon" style={{ fontSize: '12rem' }}>🔄</div>
              <div className="name" style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>Reissue Game</div>
            </div>

            
          </section>
        </main>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-left">
              <h3>LevelUpAcademy</h3>
              <p>Empowering teachers to manage gamified learning effectively.</p>
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
      </div>
    </div>
  );
};

export default TeacherHome;
