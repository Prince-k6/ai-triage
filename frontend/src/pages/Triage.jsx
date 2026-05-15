import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import ProfileDropdown from "../components/ProfileDropdown";

export default function Triage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [riskScore, setRiskScore] = useState(null);
  const [riskLevel, setRiskLevel] = useState(null);
  const [reason, setReason] = useState(null);
  
  const isReadOnly = !!id;

  useEffect(() => {
    if (id) {
      const fetchSession = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        try {
          const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
          const res = await axios.get(`${apiUrl}/triage/sessions/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const session = res.data;
          setRiskScore(session.score);
          setRiskLevel(session.level);
          setReason(session.reason);
          
          if (session.messages) {
            setMessages(JSON.parse(session.messages));
          }
        } catch (err) {
          alert("Failed to load session or session not found.");
          navigate("/dashboard");
        }
      };
      
      fetchSession();
    }
  }, [id, navigate]);

  const sendMessage = async () => {
    if (!input.trim() || isReadOnly) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to use the triage system.");
      return;
    }

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const res = await axios.post(`${apiUrl}/triage`, {
        messages: newMessages,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const reply = res.data.reply;

      const cleanReply = reply.replace(/\{.*"risk_score".*\}/s, "").trim();
      const finalMessages = [...newMessages, { role: "assistant", content: cleanReply }];

      const jsonMatch = reply.match(/\{.*"risk_score".*\}/s);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setRiskScore(parsed.risk_score);
        setRiskLevel(parsed.level);
        setReason(parsed.reason);
        
        // Auto-save the session to the database WITH messages
        await axios.post(`${apiUrl}/triage/sessions`, {
          score: parsed.risk_score,
          level: parsed.level,
          reason: parsed.reason,
          messages: JSON.stringify(finalMessages)
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setMessages(finalMessages);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert("Session expired. Please log in again.");
      } else {
        setMessages([
          ...newMessages,
          { role: "assistant", content: "Error connecting to backend." },
        ]);
      }
    }

    setLoading(false);
  };

  return (
    <div className="app-wrapper">
      <Sidebar 
        riskScore={riskScore} 
        riskLevel={riskLevel} 
        reason={reason} 
      />
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '16px', right: '24px', zIndex: 10 }}>
          <ProfileDropdown />
        </div>
        
        {isReadOnly && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            color: '#ef4444', 
            textAlign: 'center', 
            padding: '12px',
            borderBottom: '1px solid rgba(239, 68, 68, 0.2)',
            fontWeight: 500
          }}>
            Viewing a past session. This conversation is read-only.
          </div>
        )}

        <ChatArea 
          messages={messages} 
          loading={loading} 
          input={input} 
          setInput={setInput} 
          sendMessage={sendMessage} 
          isReadOnly={isReadOnly}
        />
      </div>
    </div>
  );
}