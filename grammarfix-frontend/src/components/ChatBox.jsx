import { useEffect, useRef } from 'react';

function ChatBox({ messages }) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-100 overflow-auto px-3">
      {messages.map((msg, idx) => {
        const isUser = msg.from === 'You';
        return (
          <div
            key={idx}
            className={`d-flex mb-2 ${isUser ? 'justify-content-end' : 'justify-content-start'}`}
          >
            <div
              className={`p-2 px-3 rounded-3 ${isUser ? 'bg-primary text-white' : 'bg-secondary text-white'}`}
              style={{
                maxWidth: '75%',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
                lineHeight: '1.4',
              }}
            >
              <div className="small fw-semibold mb-1">{msg.from}</div>
              <div>{msg.text}</div>
            </div>
          </div>
        );
      })}
      <div ref={chatEndRef} />
    </div>
  );
}

export default ChatBox;
