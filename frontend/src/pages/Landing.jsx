import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="login-wrapper">
      <div className="login-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
        <div className="login-icon">🏥</div>
        <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>AI Triage</h2>
        
        <p className="subtitle" style={{ fontSize: '18px', marginBottom: '40px', lineHeight: '1.6' }}>
          Your personal health assistant. Instantly assess your symptoms, get actionable guidance, and securely manage your medical history.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button onClick={() => navigate("/login")} className="btn-primary full-width">
            Sign In
          </button>
          <button onClick={() => navigate("/signup")} className="btn-outline full-width" style={{ padding: '12px' }}>
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
}
