'use client'

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function Chatbot() {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'system', text: 'Welcome to AirGlobe! How can I help you today?' },
  ]);
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  useEffect(scrollToBottom, [chatHistory]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cityMatch = userInput.match(/in\s+([a-zA-Z\s]+)(?:\?)?$/i);
    if (!cityMatch) {
      setErrorMessage('Please ask: "What is the weather in [City]?"');
      return;
    }
    const city = cityMatch[1].trim();

    const validFormat = /weather|air quality/i.test(userInput) && /in\s+\w+/i.test(userInput);
    if (!validFormat) {
      setErrorMessage('Please ask: "What is the weather in [City]?"');
      return;
    }

    setLoading(true);
    setChatHistory(prev => [...prev, { role: 'user', text: userInput }]);
    setUserInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput, city }),
      });

      if (!response.ok) throw new Error('Failed to fetch response');

      const data = await response.json();
      setChatHistory(prev => [...prev, { role: 'bot', text: data.response }]);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to get response. Please try again.');
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!showChat ? (
        <button
          onClick={() => setShowChat(true)}
          className="bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:opacity-90 transition-all"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      ) : (
        <div 
          style={{ bottom: 'calc(100% + 1rem)' }}
          className="absolute right-0 w-[320px] h-[480px] bg-background border border-border rounded-lg shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <h3 className="font-semibold">AirGlobe Assistant</h3>
            </div>
            <button 
              onClick={() => setShowChat(false)}
              className="hover:opacity-75 rounded-full p-1 transition-opacity"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-secondary/20" style={{ height: 'calc(100% - 120px)' }}>
            <div className="space-y-4">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-secondary text-secondary-foreground rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm p-2 break-words">{message.text}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-secondary p-3 rounded-lg rounded-bl-none">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="px-4 py-2 text-destructive text-sm bg-destructive/10">
              {errorMessage}
            </div>
          )}

          {/* Input form */}
          <form onSubmit={handleSubmit} className="p-4 bg-background border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask about weather... "
                className="flex-1 px-4 py-2 rounded-full bg-secondary text-secondary-foreground border-none text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !userInput.trim()}
                className="bg-primary text-primary-foreground p-4 rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                aria-label="Send message"
              >
                <Send className=" w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
