import React, { useState } from "react";

const SendMessage = ({ onMessageSent }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      if (data.success) {
        onMessageSent(data.data); // notify parent about new message
        setMessage("");
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div style={{ display: "flex", marginTop: "10px" }}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        style={{
          flex: 1,
          padding: "10px",
          borderRadius: "20px",
          border: "1px solid #ccc",
          outline: "none",
        }}
      />
      <button
        onClick={handleSend}
        disabled={loading}
        style={{
          marginLeft: "10px",
          padding: "10px 20px",
          borderRadius: "20px",
          border: "none",
          backgroundColor: "#0b93f6",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

export default SendMessage;
