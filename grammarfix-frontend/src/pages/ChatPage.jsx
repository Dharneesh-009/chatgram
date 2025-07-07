// src/pages/ChatPage.jsx
import { useState } from 'react';
import ChatInput from '../components/ChatInput';
import ChatBox from '../components/ChatBox';

function ChatPage() {
  const [messages, setMessages] = useState([]);

  const handleSend = (text) => {
    const newMsg = { from: 'You', text };
    setMessages([...messages, newMsg]);
  };

  return (
    <div className="container-fluid vh-100 bg-dark d-flex justify-content-center align-items-center">
      <div className="card shadow-lg w-100" style={{ maxWidth: '700px', height: '90vh', backgroundColor: '#1e1e2f', color: 'white' }}>
        <div className="p-3 overflow-auto" style={{ height: '70%', borderBottom: '1px solid #444' }}>
          <ChatBox messages={messages} />
        </div>
        <div className="p-3" style={{ height: '30%' }}>
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
