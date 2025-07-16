import React from 'react';
import ChatClient from './ChatClient';

function App() {
  const currentUserId = 1; // simulate login user
  const targetUserId = 2;  // simulate receiver

  return (
    <div>
      <h2 style={{ textAlign: 'center', color: 'white' }}>Chat App</h2>
      <ChatClient userId={currentUserId} targetId={targetUserId} />
    </div>
  );
}

export default App;
