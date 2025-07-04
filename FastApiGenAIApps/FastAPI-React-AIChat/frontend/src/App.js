import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import FloatingParticles from './FloatingParticles';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const messagesEndRef = useRef(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/health`);
      setBackendStatus(response.data.status === 'healthy' ? 'connected' : 'error');
    } catch (error) {
      setBackendStatus('disconnected');
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Add user message to chat
    const newMessages = [...messages, { type: 'user', content: userMessage }];
    setMessages(newMessages);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/chat`, {
        message: userMessage
      }, {
        timeout: 30000
      });

      const aiResponse = response.data.response || 'No response received';
      setMessages([...newMessages, { type: 'ai', content: aiResponse }]);
    } catch (error) {
      let errorMessage = 'Sorry, something went wrong. Please try again.';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please check the backend logs.';
      } else if (!error.response) {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      }

      setMessages([...newMessages, { type: 'error', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };



  return (
    <div className="App">
      <FloatingParticles />
      <div className="chat-container">
        <div className="chat-header">
          <h1>🤖 AI Chat Assistant</h1>
          <div className={`status-indicator ${backendStatus}`}>
            <span className="status-dot"></span>
            <span className="status-text">
              {backendStatus === 'connected' ? 'Connected' : 
               backendStatus === 'disconnected' ? 'Disconnected' : 
               backendStatus === 'error' ? 'Error' : 'Checking...'}
            </span>
            <button className="refresh-btn" onClick={checkBackendHealth}>
              🔄
            </button>
          </div>
        </div>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="welcome-section">
              <div className="welcome-message">
                <h2>👋 Welcome to AI Chat!</h2>
                <div className="chat-input-container">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here... (Press Enter to send)"
                    className="chat-input welcome-input"
                    rows="3"
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="send-button"
                  >
                    {isLoading ? '⏳' : '🚀'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                <div className="message-content">
                  <div className="message-avatar">
                    {message.type === 'user' ? '👤' : message.type === 'error' ? '⚠️' : '🤖'}
                  </div>
                  <div className="message-text">
                    {message.content}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && messages.length > 0 && (
            <div className="message ai">
              <div className="message-content">
                <div className="message-avatar">🤖</div>
                <div className="message-text">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length > 0 && (
          <div className="chat-input-section">
            <div className="chat-input-container">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here... (Press Enter to send)"
                className="chat-input"
                rows="1"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="send-button"
              >
                {isLoading ? '⏳' : '🚀'}
              </button>
              <button
                onClick={clearChat}
                className="clear-button"
                title="Clear chat"
              >
                🗑️
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
