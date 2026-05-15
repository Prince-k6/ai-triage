import React from "react";
import "./components.css";

export default function MessageBubble({ msg }) {
  const isUser = msg.role === "user";

  return (
    <div className={`message-bubble ${isUser ? "user" : "assistant"}`}>
      {msg.content}
    </div>
  );
}
