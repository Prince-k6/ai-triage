import { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";

export default function Triage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [riskScore, setRiskScore] = useState(null);
  const [riskLevel, setRiskLevel] = useState(null);
  const [reason, setReason] = useState(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "/api";
      const res = await axios.post(`${apiUrl}/triage`, {
        messages: newMessages,
      });

      const reply = res.data.reply;

      const jsonMatch = reply.match(/\{.*"risk_score".*\}/s);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setRiskScore(parsed.risk_score);
        setRiskLevel(parsed.level);
        setReason(parsed.reason);
      }

      const cleanReply = reply.replace(/\{.*"risk_score".*\}/s, "").trim();

      setMessages([...newMessages, { role: "assistant", content: cleanReply }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Error connecting to backend. Make sure it is running." },
      ]);
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
      <ChatArea 
        messages={messages} 
        loading={loading} 
        input={input} 
        setInput={setInput} 
        sendMessage={sendMessage} 
      />
    </div>
  );
}