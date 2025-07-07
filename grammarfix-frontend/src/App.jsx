// src/App.jsx
import { useEffect, useRef, useState } from 'react';
import ChatInput from './components/ChatInput';
import ChatBox from './components/ChatBox';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // or './styles.css' if you created another file


function App() {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:8080/ws/chat');

    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  const handleSend = (text) => {
    const message = {
      from: 'You',
      text,
      time: new Date().toISOString(),
    };
    socketRef.current.send(JSON.stringify(message));
    setMessages((prev) => [...prev, message]);
  };

  return (
    <div className="vh-100 vw-100 d-flex flex-column bg-dark text-white">
      <header className="py-3 px-4 border-bottom border-secondary d-flex align-items-center justify-content-between" style={{ backgroundColor: "#1a1a2f" }}>
        <h5 className="mb-0">💬 D's Grammar Chat AI</h5>
      </header>

      <div className="flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="w-100 h-100 d-flex flex-column" style={{ maxWidth: "800px" }}>
          <div className="flex-grow-1 overflow-auto p-3 border-bottom border-secondary">
            <ChatBox messages={messages} />
          </div>
          <div className="p-3 border-top border-secondary">
            <ChatInput onSend={handleSend} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;