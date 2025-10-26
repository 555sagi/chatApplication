import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/getMessage');
      const result = await response.json();
      if (result.success && result.data) {
        // Sort messages by timestamp
        const sortedMessages = result.data.sort((a, b) => 
          new Date(a.createdAt) - new Date(b.createdAt)
        );
        setMessages(sortedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || sending) return;

    setSending(true);
    try {
      const response = await fetch('http://localhost:3000/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      if (response.ok) {
        setInputMessage('');
        await fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#0a1014',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#1f2c33',
        padding: '16px',
        borderBottom: '1px solid #2a3942'
      }}>
        <div style={{ color: '#e9edef', fontSize: '20px', fontWeight: '500' }}>
          Chat
        </div>
      </div>

      {/* Messages Container */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        backgroundImage: 'linear-gradient(to bottom, #0a1014 0%, #0d1418 100%)',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          pointerEvents: 'none'
        }} />

        {loading && messages.length === 0 ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            color: '#8696a0'
          }}>
            Loading messages...
          </div>
        ) : (
          <div style={{ position: 'relative', zIndex: 1 }}>
            {messages.map((msg, index) => {
              const isMine = msg.message.includes('by Ashok');
              const displayMessage = isMine ? msg.message.replace('by Ashok', '').trim() : msg.message;
              
              return (
                <div
                  key={msg._id}
                  style={{
                    display: 'flex',
                    justifyContent: isMine ? 'flex-end' : 'flex-start',
                    marginBottom: '8px',
                    animation: 'slideIn 0.3s ease-out'
                  }}
                >
                  <div style={{
                    maxWidth: '65%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: isMine ? '#005c4b' : '#1f2c33',
                    color: '#e9edef',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    position: 'relative'
                  }}>
                    <div style={{ fontSize: '14.2px', lineHeight: '19px', wordBreak: 'break-word' }}>
                      {displayMessage}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: '#8696a0',
                      marginTop: '4px',
                      textAlign: 'right'
                    }}>
                      {formatTime(msg.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Container */}
      <div style={{
        backgroundColor: '#1f2c33',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderTop: '1px solid #2a3942'
      }}>
        <div style={{
          flex: 1,
          backgroundColor: '#2a3942',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          padding: '8px 12px'
        }}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message"
            disabled={sending}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#e9edef',
              fontSize: '15px',
              fontFamily: 'inherit'
            }}
          />
        </div>
        <button
          onClick={sendMessage}
          disabled={!inputMessage.trim() || sending}
          style={{
            backgroundColor: inputMessage.trim() ? '#00a884' : '#2a3942',
            border: 'none',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputMessage.trim() && !sending ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            opacity: sending ? 0.6 : 1
          }}
        >
          <Send size={20} color={inputMessage.trim() ? '#ffffff' : '#8696a0'} />
        </button>
      </div>

      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          input::placeholder {
            color: #8696a0;
          }
        `}
      </style>
    </div>
  );
}