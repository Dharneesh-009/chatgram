import { useState } from 'react';
import axios from 'axios';
import { FaMagic, FaRobot, FaPaperPlane } from 'react-icons/fa';

function ChatInput({ onSend }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

const handleGrammarCheck = async () => {
  setLoading(true);
  const endpoint = 'http://localhost:8080/api/grammar/groq';

  try {
    const res = await axios.post(
      endpoint,
      { text: input },
      { headers: { 'Content-Type': 'application/json' } }
    );

    let corrected = res.data.corrected || res.data;

    corrected = corrected
      .replace(/^I think you meant to say[:\-]?\s*/i, '')
      .replace(/^The correction is[:\-]?\s*/i, '')
      .replace(/[*•\-]\s?.*/g, '') // remove bullet points
      .split('\n')[0]              // take only first line
      .replace(/^[“"]|[”"]$/g, '') // trim quotes
      .trim();

    setInput(corrected);  // Optional if you want to show in textbox
    onSend(corrected);    // ✅ Send to chat
  } catch (err) {
    console.error(err);
    alert('Grammar check failed');
  }

  setLoading(false);
};



  const handleSend = () => {
    if (input.trim() !== '') {
      onSend(input);
      setInput('');
    }
  };

return (
    <div>
      <textarea
        className="form-control mb-3"
        placeholder="Type your message..."
        rows={3}
        maxLength={500}
        style={{ backgroundColor: "#2c2c3b", color: "white", border: "1px solid #444" }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <small className="text-muted">{input.length}/500</small>
        {loading && <span className="text-info">Checking...</span>}
      </div>

      <div className="d-flex justify-content-between">
        <div className="btn-group">
         
          <button
            className="btn btn-outline-light d-flex align-items-center gap-1"
            onClick={() => handleGrammarCheck('groq')}
            disabled={loading}
          >
            <FaRobot /> Groq AI
          </button>
        </div>

        <button
          className="btn btn-success d-flex align-items-center gap-2"
          onClick={handleSend}
          disabled={loading || input.trim() === ''}
        >
          <FaPaperPlane /> Send
        </button>
      </div>
    </div>
  );
}


export default ChatInput;
