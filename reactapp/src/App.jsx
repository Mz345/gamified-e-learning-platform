import { useEffect, createContext, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';

import Welcome from './pages/Welcome';
import RoleSelection from './pages/RoleSelection';
import Login from './pages/Login';
import Register from './pages/Register';

import StudentHome from './pages/StudentHome';
import TeacherHome from './pages/TeacherHome';
import AboutPage from './pages/AboutPage';
import Settings from './components/Settings';
import Leaderboard from './components/LeaderBoard';
import GameSelectionPage from './pages/GameSelectionPage';
import GamePlayPage from './pages/GamePage';
import MessagingPage from './components/MessagingPage';
import ReissueGamePage from './pages/ReissueGamePage';
import MainLayout from './components/MainLayout';


import { UserProvider } from './context/UserContext'; // ✅ Import UserProvider

// Create Socket Context
export const SocketContext = createContext(null);

const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

function App() {
  const userId = localStorage.getItem('userId');

  const socket = useMemo(() => {
    const options = { transports: ['websocket'], query: {} };
    if (userId) options.query.userId = userId;
    return io(SOCKET_SERVER_URL, options);
  }, [userId]);

  useEffect(() => {
    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket]);

  return (
    <UserProvider> {/* ✅ Wrap everything in UserProvider */}
      <SocketContext.Provider value={socket}>
        <Router>
          <Routes>
            {/* Public pages (no sidebar) */}
            <Route path="/" element={<Welcome />} />
            <Route path="/select-role" element={<RoleSelection />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/game-selection/:subject" element={<GameSelectionPage />} />
            <Route path="/game-play/:subject/:game" element={<GamePlayPage />} />

            {/* Private pages (with sidebar) */}
            <Route element={<MainLayout />}>
              <Route path="/studenthome" element={<StudentHome />} />
              <Route path="/teacherhome" element={<TeacherHome />} />
              <Route path="/teacher/reissue/:subjectId" element={<ReissueGamePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              
              <Route path="/messages" element={<MessagingPage />} />
            </Route>
          </Routes>
        </Router>
      </SocketContext.Provider>
    </UserProvider>
  );
}

export default App;
