import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const ChatInterface = ({ onNewResponse }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSeeds, setActiveSeeds] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/query`, {
        text: input,
        context: {}
      });

      const aiMessage = { 
        role: 'assistant', 
        content: response.data.response,
        seeds: response.data.active_seeds || [],
        reasoning: response.data.reasoning || []
      };
      setMessages(prev => [...prev, aiMessage]);
      
      // Notify parent component of new response
      onNewResponse({
        seeds: response.data.active_seeds,
        trace_log: response.data.trace_log
      });
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'error',
        content: 'Er is een fout opgetreden bij het verwerken van je bericht.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-3xl rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-blue-500 bg-opacity-20 backdrop-blur-lg backdrop-filter backdrop-saturate-150'
                  : message.role === 'error'
                  ? 'bg-red-500 bg-opacity-20 backdrop-blur-lg backdrop-filter'
                  : 'bg-white bg-opacity-10 backdrop-blur-lg backdrop-filter backdrop-saturate-150'
              } text-white border border-white border-opacity-20`}
            >
              <ReactMarkdown className="prose prose-invert">
                {message.content}
              </ReactMarkdown>
              
              {message.role === 'assistant' && message.seeds && (
                <div className="mt-4 pt-4 border-t border-white border-opacity-20">
                  <h4 className="text-sm font-semibold text-blue-300 mb-2">Actieve Seeds:</h4>
                  <div className="flex flex-wrap gap-2">
                    {message.seeds.map((seed, i) => (
                      <span 
                        key={i}
                        className="px-2 py-1 text-xs rounded-full bg-blue-500 bg-opacity-20 backdrop-blur-sm"
                      >
                        {seed.id}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {message.role === 'assistant' && message.reasoning && (
                <div className="mt-4 pt-4 border-t border-white border-opacity-20">
                  <h4 className="text-sm font-semibold text-purple-300 mb-2">Redenering:</h4>
                  <div className="text-sm text-gray-300">
                    {message.reasoning.map((step, i) => (
                      <div key={i} className="mb-2">
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-white border-opacity-20 bg-gray-900 bg-opacity-50 backdrop-blur-lg backdrop-filter">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Stel een vraag aan EvAI..."
            className="flex-1 p-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 backdrop-blur-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-500 bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 backdrop-blur-sm border border-white border-opacity-20"
          >
            {isLoading ? 'Verwerken...' : 'Versturen'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface; 