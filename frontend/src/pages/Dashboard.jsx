import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  // Mock past sessions
  const pastSessions = [
    { id: 1, date: "Today", reason: "Mild Fever and Cough", score: 30, level: "home" },
    { id: 2, date: "Oct 12, 2026", reason: "Severe back pain", score: 55, level: "clinic" },
    { id: 3, date: "Sep 04, 2026", reason: "Chest tightness", score: 85, level: "emergency" },
  ];

  const levelColors = {
    home: "#22c55e",
    clinic: "#f59e0b",
    emergency: "#ef4444",
  };

  const levelLabels = {
    home: "Home Care",
    clinic: "Clinic Visit",
    emergency: "Emergency",
  };

  return (
    <div className="page-wrapper">
      {/* Top Navbar */}
      <nav className="navbar">
        <h2 className="logo">🏥 AI Triage</h2>
        <button onClick={() => navigate("/login")} className="btn-outline">Sign Out</button>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>Welcome Back</h1>
            <p className="subtitle">Review your past assessments or start a new one.</p>
          </div>
          <Link to="/triage" className="btn-primary">
            + Start New Triage
          </Link>
        </div>

        <div className="sessions-grid">
          {pastSessions.map(session => (
            <div key={session.id} className="session-card">
              <div className="session-card-header">
                <span className="session-date">{session.date}</span>
                <span 
                  className="session-badge"
                  style={{ 
                    background: levelColors[session.level] + "22",
                    color: levelColors[session.level]
                  }}
                >
                  {levelLabels[session.level]}
                </span>
              </div>
              <h3 className="session-reason">{session.reason}</h3>
              <div className="session-score">
                Risk Score: <strong>{session.score}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
