import { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import ProfileDropdown from "../components/ProfileDropdown";

export default function Triage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [riskScore, setRiskScore] = useState(null);
  const [riskLevel, setRiskLevel] = useState(null);
  const [reason, setReason] = useState(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

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

      const jsonMatch = reply.match(/\{.*"risk_score".*\}/s);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setRiskScore(parsed.risk_score);
        setRiskLevel(parsed.level);
        setReason(parsed.reason);
        
        // Auto-save the session to the database
        await axios.post(`${apiUrl}/triage/sessions`, {
          score: parsed.risk_score,
          level: parsed.level,
          reason: parsed.reason
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      const cleanReply = reply.replace(/\{.*"risk_score".*\}/s, "").trim();

      setMessages([...newMessages, { role: "assistant", content: cleanReply }]);
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
      <div style={{ position: 'relative', flex: 1, display: 'flex' }}>
        <div style={{ position: 'absolute', top: '16px', right: '24px', zIndex: 10 }}>
          <ProfileDropdown />
        </div>
        <ChatArea 
          messages={messages} 
          loading={loading} 
          input={input} 
          setInput={setInput} 
          sendMessage={sendMessage} 
        />
      </div>
    </div>
  );
}