import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileDropdown() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const res = await fetch(`${apiUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Failed to fetch user");
      }
    };
    fetchUser();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <>
      <div className="nav-profile-container">
        <div 
          className="nav-profile-trigger" 
          onClick={() => setSidebarOpen(true)}
        >
          <div className="nav-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="nav-username">{user.name}</span>
        </div>
      </div>

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}>
          <div className="profile-sidebar" onClick={e => e.stopPropagation()}>
            <div className="sidebar-header">
              <h2>My Profile</h2>
              <button className="close-btn" onClick={() => setSidebarOpen(false)}>✕</button>
            </div>
            
            <div className="sidebar-content">
              <div className="sidebar-avatar-large">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="sidebar-name">{user.name}</h3>
              <p className="sidebar-email">{user.email}</p>
              
              <div className="sidebar-actions">
                <button onClick={handleSignOut} className="btn-primary full-width" style={{ background: '#ef4444', marginTop: '40px' }}>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
