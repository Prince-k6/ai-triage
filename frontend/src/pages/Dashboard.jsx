import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileDropdown from "../components/ProfileDropdown";

export default function Dashboard() {
  const navigate = useNavigate();

  const [pastSessions, setPastSessions] = React.useState([]);

  React.useEffect(() => {
    const fetchSessions = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");
      
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const res = await fetch(`${apiUrl}/triage/sessions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 401) {
          localStorage.removeItem("token");
          return navigate("/login");
        }
        const data = await res.json();
        // format dates
        const formatted = data.map(s => ({
          ...s,
          date: new Date(s.date).toLocaleDateString()
        }));
        setPastSessions(formatted);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSessions();
  }, [navigate]);

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
        <ProfileDropdown />
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
