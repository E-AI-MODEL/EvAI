import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0) 100%);
    pointer-events: none;
    z-index: 1;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Message = styled(motion.div)`
  padding: 1.2rem;
  border-radius: 1.2rem;
  max-width: 80%;
  position: relative;
  ${props => props.isUser ? `
    align-self: flex-end;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
    border: 1px solid rgba(59, 130, 246, 0.2);
  ` : `
    align-self: flex-start;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
    border: 1px solid rgba(16, 185, 129, 0.2);
  `}
  backdrop-filter: blur(10px);
  color: #e2e8f0;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.2);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 1.2rem;
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
    pointer-events: none;
  }
`;

const InputContainer = styled(motion.form)`
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:focus-within {
    background: rgba(15, 23, 42, 0.9);
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(59, 130, 246, 0.5);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const SendButton = styled(motion.button)`
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.8rem;
  background: linear-gradient(45deg, #3b82f6, #10b981);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px -4px rgba(59, 130, 246, 0.4);
    
    &::before {
      opacity: 1;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ChatInterface = ({ onNewResponse }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      const API_URL = process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'
        : 'http://localhost:8000';

      const response = await axios.post(`${API_URL}/chat`, {
        message: userMessage
      });

      setMessages(prev => [...prev, { text: response.data.response, isUser: false }]);
      
      if (onNewResponse) {
        onNewResponse({
          seeds: response.data.seeds,
          trace_log: response.data.trace_log
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: 'Sorry, er is een fout opgetreden. Probeer het later opnieuw.', 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <MessagesContainer>
        <AnimatePresence>
          {messages.map((message, index) => (
            <Message
              key={index}
              isUser={message.isUser}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {message.text}
            </Message>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputContainer
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type je bericht..."
          disabled={isLoading}
        />
        <SendButton
          type="submit"
          disabled={isLoading || !input.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? 'Verzenden...' : 'Verstuur'}
        </SendButton>
      </InputContainer>
    </Container>
  );
};

export default ChatInterface; 