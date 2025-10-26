import React, { useEffect, useState } from "react";
import Conversation from "./components/Conversation";
import SendMessage from "./components/SendMessage";
import ChatApp from "./components/ChatApp";
const App = () => {
  const [messages, setMessages] = useState([]);

  // Load initial messages once
  const fetchMessages = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/messages");
      const data = await res.json();
      if (data.success) setMessages(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div>

      <ChatApp />
    </div>
  );
};

export default App;
