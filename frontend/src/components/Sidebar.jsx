import React from "react";
import "./components.css";

const levelColors = {
  home: "#22c55e",
  clinic: "#f59e0b",
  emergency: "#ef4444",
};

const levelLabels = {
  home: "🏠 Home Care",
  clinic: "🏥 Visit a Clinic",
  emergency: "🚨 Go to Emergency Room NOW",
};

export default function Sidebar({ riskScore, riskLevel, reason }) {
  return (
    <div className="sidebar">
      <h2>🏥 AI Triage</h2>
      <p className="subtitle">Describe your symptoms and get instant guidance.</p>

      {riskScore !== null && (
        <div className="risk-card">
          <p className="risk-label">RISK SCORE</p>
          <div className="risk-score" style={{ color: levelColors[riskLevel] }}>
            {riskScore}
          </div>
          <div 
            className="risk-level" 
            style={{ 
              background: levelColors[riskLevel] + "22", 
              color: levelColors[riskLevel] 
            }}
          >
            {levelLabels[riskLevel]}
          </div>
          {reason && <p className="risk-reason">{reason}</p>}
        </div>
      )}

      <div className="sidebar-disclaimer">
        ⚠️ This is not a substitute for professional medical advice. Always consult a doctor.
      </div>
    </div>
  );
}
