// widget/src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Your Backend URL

function App({ shadowRoot }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setChat((prev) => [...prev, { ...data, type: 'support' }]);
    });
    return () => socket.off('receive_message');
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const sendMsg = () => {
    if (!message.trim()) return;
    setChat((prev) => [...prev, { text: message, type: 'user' }]);
    socket.emit('send_message', { text: message });
    setMessage('');
  };

  return (
    <>
      {/* SCOPED CSS FOR SHADOW DOM */}
      <style>{`
        .launcher { position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; background: #007bff; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.2); z-index: 9999; }
        .window { position: fixed; bottom: 90px; right: 20px; width: 350px; height: 500px; background: white; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); display: ${isOpen ? 'flex' : 'none'}; flex-direction: column; overflow: hidden; font-family: sans-serif; z-index: 9999; border: 1px solid #eee; }
        .header { background: #007bff; color: white; padding: 15px; font-weight: bold; display: flex; justify-content: space-between; }
        .messages { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; background: #fdfdfd; }
        .bubble { max-width: 80%; padding: 10px; border-radius: 12px; font-size: 14px; }
        .user { align-self: flex-end; background: #007bff; color: white; }
        .support { align-self: flex-start; background: #e9e9eb; color: #333; }
        .input-box { display: flex; border-top: 1px solid #eee; }
        input { flex: 1; border: none; padding: 15px; outline: none; }
        button { background: #007bff; color: white; border: none; padding: 0 20px; cursor: pointer; }
      `}</style>

      <div className="launcher" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '💬'}
      </div>

      <div className="window">
        <div className="header">Live Support</div>
        <div className="messages">
          {chat.map((msg, i) => (
            <div key={i} className={`bubble ${msg.type}`}>{msg.text}</div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="input-box">
          <input 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && sendMsg()}
            placeholder="Ask us anything..."
          />
          <button onClick={sendMsg}>Send</button>
        </div>
      </div>
    </>
  );
}

export default App;