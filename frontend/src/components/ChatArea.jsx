import React from "react";
import MessageBubble from "./MessageBubble";
import "./components.css";

export default function ChatArea({ messages, loading, input, setInput, sendMessage, isReadOnly }) {
  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chat-container">
      
      {/* Messages */}
      <div className="messages-area">
        {messages.length === 0 && !isReadOnly && (
          <div className="empty-state">
            <div className="icon">🩺</div>
            <h3>Hello! I'm your AI Triage Assistant</h3>
            <p>Tell me what symptoms you're experiencing and I'll help assess your condition.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}

        {loading && (
          <div className="loading-bubble">
            Analyzing your symptoms...
          </div>
        )}
      </div>

      {/* Input */}
      {!isReadOnly && (
        <div className="input-area">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Describe your symptoms..."
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className={loading ? "disabled" : "active"}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}
