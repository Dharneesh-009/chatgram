import { useEffect, useRef, useState } from 'react';
import ChatInput from './components/ChatInput';
import ChatBox from './components/ChatBox';
import 'bootstrap/dist/css/bootstrap.min.css';

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
      from: 'You', // Replace with actual username if login is added
      text,
      time: new Date().toISOString(),
    };
    socketRef.current.send(JSON.stringify(message));
    setMessages((prev) => [...prev, message]);
  };

  return (
   <div className="vh-100 bg-dark text-white d-flex flex-column">
  {/* Header */}
  <header className="py-3 px-4 border-bottom border-secondary d-flex justify-content-between align-items-center" style={{ backgroundColor: "#1a1a2f" }}>
    <h5 className="mb-0">💬 Grammar Chat AI</h5>
  </header>

  {/* Chat area */}
  <div className="flex-grow-1 d-flex justify-content-center align-items-center" style={{ backgroundColor: "#1e1e2f" }}>
    <div className="w-100" style={{ maxWidth: '800px', height: '100%' }}>
      {/* Chat history box */}
      <div className="d-flex flex-column h-100">
        <div className="flex-grow-1 overflow-auto p-3 border-bottom border-secondary">
          <ChatBox messages={messages} />
        </div>

        <div className="p-3 border-top border-secondary">
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </div>
  </div>
</div>

  );
}

export default App;

