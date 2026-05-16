import axios from "axios";
import { useState } from "react";
import '../styles/ReissueGamePage.css'; // Make sure this path is correct

function ReissueGame() {
  const [subjectName, setSubjectName] = useState("English");
  const [gameName, setGameName] = useState("QuizMaster");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReissue = async () => {
    if (!gameName.trim()) {
      setMessage("Please enter a valid game name.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/reissue", {
        subjectName,
        gameName,
      });
      setMessage(res.data.message);
    } catch (err) {
      console.error("Reissue error:", err);
      setMessage(err.response?.data?.message || "Error reissuing game");
    }
    setLoading(false);
  };

  return (
    <div className="reissue-game-container">
      <div className="reissue-card">
        <h3 className="reissue-title">Reissue Game for All Students</h3>

        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <select
            id="subject"
            className="form-select"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
          >
            <option>English</option>
            <option>Maths</option>
            <option>Science</option>
            <option>History</option>
            <option>Computer Science</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="game">Game Name</label>
          <input
            id="game"
            type="text"
            className="form-input"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            placeholder="Enter game name"
          />
        </div>

        <button onClick={handleReissue} className="reissue-button" disabled={loading}>
          {loading ? "Reissuing..." : "Reissue Game"}
        </button>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default ReissueGame;
