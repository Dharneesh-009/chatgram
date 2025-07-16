import React, { useEffect, useRef, useState } from 'react';

function ChatClient({ userId, targetId }) {
  const [socket, setSocket] = useState(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  // Connect to WebSocket
  useEffect(() => {
    if (!userId) {
      console.error("userId is missing!");
      return;
    }

    const ws = new WebSocket(`ws://localhost:8080/ws/chat?userId=${userId}`);
    setSocket(ws);

    ws.onopen = () => {
      console.log(`✅ WebSocket connected for user ${userId}`);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessages((prev) => [...prev, msg]);
    };

    ws.onclose = () => {
      console.log("❌ WebSocket disconnected");
    };

    return () => ws.close();
  }, [userId]);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const handleSend = () => {
    if (!input.trim()) return;

    const msg = {
      senderId: userId,
      receiverId: targetId,
      text: input,
    };

    try {
      socket.send(JSON.stringify(msg));
      setInput('');
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.messageBubble,
              alignSelf: msg.senderId === userId ? 'flex-end' : 'flex-start',
              backgroundColor: msg.senderId === userId ? '#4caf50' : '#444',
              color: '#fff',
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
              {msg.senderId === userId ? 'You' : `User ${msg.senderId}`}
            </div>
            <div>{msg.text}</div>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      <div style={styles.inputBox}>
        <textarea
          rows={2}
          style={styles.textArea}
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button onClick={handleSend} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
}

// 🎨 Basic Styling
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '90vh',
    width: '100%',
    padding: '10px',
    backgroundColor: '#1e1e2f',
    color: 'white',
  },
  chatBox: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
    gap: '10px',
    border: '1px solid #555',
    borderRadius: '8px',
    backgroundColor: '#2c2c3c',
  },
  messageBubble: {
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '70%',
  },
  inputBox: {
    marginTop: '10px',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  textArea: {
    flex: 1,
    resize: 'none',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#333',
    color: '#fff',
    border: '1px solid #666',
  },
  sendButton: {
    padding: '10px 16px',
    backgroundColor: '#4caf50',
    border: 'none',
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default ChatClient;
