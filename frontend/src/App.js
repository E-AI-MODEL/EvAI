import React from 'react';
import './App.css';
import ChatInterface from './components/ChatInterface';
import InsightPanel from './components/InsightPanel';
import AnimatedBackground from './components/AnimatedBackground';

function App() {
  return (
    <div className="App">
      <AnimatedBackground />
      <div className="main-container">
        <ChatInterface />
        <InsightPanel />
      </div>
    </div>
  );
}

export default App; 