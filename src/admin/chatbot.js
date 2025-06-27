import { useState, useRef, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const { settings } = useSettings();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const appendMessage = (text, sender) => {
    setMessages(prev => [...prev, { text, sender }]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    appendMessage("You: " + trimmed, 'user');
    setInput('');

    try {
      const res = await fetch(`${settings.api_url}/api/v1/botman.php?message=${encodeURIComponent(trimmed)}`, {
        credentials: 'include'
      });
      const json = await res.json();


      if (json.messages && Array.isArray(json.messages)) {
        json.messages.forEach(msg => {
          if (msg.type === 'text' && msg.text) {
            appendMessage("Bot: " + msg.text, 'bot');
          }
        });
      } else {
        appendMessage("Bot: Unexpected response format.", 'bot');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      appendMessage("Bot: Failed to connect to the server.", 'bot');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div style={{
        height: '300px',
        overflowY: 'auto',
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '4px',
        background: '#f9f9f9'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            margin: '5px 0',
            textAlign: msg.sender === 'user' ? 'right' : 'left'
          }}>
            <span>{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} style={{ marginTop: '10px', display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 12px' }}>Send</button>
      </form>
    </div>
  );
};

export default Chatbot;
