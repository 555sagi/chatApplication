import React from "react";

const Conversation = ({ messages }) => {
  return (
    <div
      style={{
        height: "400px",
        width: "300px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "10px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {messages.map((msg) => (
        <div
          key={msg._id}
          style={{
            maxWidth: "70%",
            padding: "10px",
            borderRadius: "15px",
            backgroundColor: "#f1f0f0",
            alignSelf: "flex-start",
          }}
        >
          <p style={{ margin: 0 }}>{msg.message}</p>
          <span style={{ fontSize: "10px", color: "#999" }}>
            {new Date(msg.createdAt).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Conversation;
