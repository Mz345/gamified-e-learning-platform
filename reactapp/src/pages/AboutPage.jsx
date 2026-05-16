import React from 'react';
import '../styles/AboutPage.css';

const AboutPage = () => {
  return (
    <div className="home-wrapper">
      <div className="page-container">
        <div className="about-container fade-in">
          <div className="about-box">
            <h1 className="gradient-title">🚀 About Us</h1>
            <p className="intro">
              Welcome to <strong>Gamified E-Learning</strong> — where learning becomes an adventure! 🎮
            </p>

            <section>
              <h2>🎯 Our Vision</h2>
              <ul>
                <li>Make learning <strong>fun and interactive</strong>.</li>
                <li>Encourage <strong>competition</strong> through leaderboards and scores.</li>
                <li>Promote <strong>engagement</strong> through gamified modules.</li>
              </ul>
            </section>

            <section>
              <h2>🧩 Key Features</h2>
              <ul>
                <li><span className="highlight">Games:</span> Quizzes, Match Pairs, Flashcards & True/False</li>
                <li><span className="highlight">Leaderboard:</span> Real-time daily, weekly, monthly rankings</li>
                <li><span className="highlight">Secure Points:</span> Score saved only on first attempt</li>
                <li><span className="highlight">Messaging:</span> Chat & file sharing for teachers & students</li>
              </ul>
            </section>

            <section>
              <h2>👥 Who Benefits?</h2>
              <ul>
                <li><strong>Students:</strong> Learn with joy and curiosity</li>
                <li><strong>Teachers:</strong> Track progress and assign challenges</li>
              </ul>
            </section>

            

            <blockquote>
              “Gamification isn’t just fun — it’s the future of effective learning.” 🚀
            </blockquote>

            <p className="cta">
              Ready to level up your learning journey? <br />
              Let the games begin! 🎓🔥
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
