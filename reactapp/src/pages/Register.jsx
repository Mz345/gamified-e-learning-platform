// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Auth.css';

function Register() {
  const navigate = useNavigate();
  const locationState = useLocation();
  const role = locationState.state?.role || localStorage.getItem("selectedRole");

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      alert("Role is not defined. Please go back and select a role.");
      return;
    }

    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/${role}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        navigate("/login", { state: { role } });
      } else {
        alert(result.error || "Something went wrong during registration.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Create an Account ({role})</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          onChange={handleChange}
          value={data.name}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          value={data.email}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          value={data.password}
          required
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          onChange={handleChange}
          value={data.confirmPassword}
          required
        />
        <button type="submit">Register</button>
      </form>

      <div className="auth-links">
        <p>
          Already have an account?{" "}
          <button type="button" className="link-button" onClick={() => navigate("/login", { state: { role } })}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
