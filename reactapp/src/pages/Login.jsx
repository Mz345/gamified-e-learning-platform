import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/Auth.css';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRoleState] = useState(null);
  const [data, setData] = useState({ email: "", password: "" });

  const { setName, setRole, setAvatar, setId } = useContext(UserContext);

  useEffect(() => {
    const savedRole = location.state?.role || localStorage.getItem("role");
    if (savedRole) {
      setRoleState(savedRole);
    } else {
      alert("Role not defined. Please go back and select a role.");
      navigate("/");
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5000/api/${role}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      console.log("Login result:", result);

      if (res.ok) {
        alert("Login successful!");

        const userName = result.name || result.teacherName || result.studentName || "User";

        localStorage.setItem("token", result.token);
        localStorage.setItem("role", role);
        localStorage.setItem("name", userName);
        localStorage.setItem("id", result._id);
        localStorage.setItem("profileImage", result.profileImage || '/avatar/avatar.svg');

        // ✅ Also store studentId if the role is student
        if (role === "student") {
          localStorage.setItem("studentId", result._id);
        }

        setRole(role);
        setName(userName);
        setAvatar(result.profileImage || '/avatar/avatar.svg');
        setId(result._id);

        navigate(role === "teacher" ? "/teacherhome" : "/studenthome");
      } else {
        alert(result.error || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login as {role}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <div className="auth-links">
        <p>
          Don't have an account?{" "}
          <button type="button" className="link-button" onClick={() => navigate("/register", { state: { role } })}>
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
