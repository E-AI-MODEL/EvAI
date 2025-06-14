import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import AnimatedBackground from './components/AnimatedBackground';
import InsightPanel from './components/InsightPanel';

function App() {
  const [activeSeeds, setActiveSeeds] = useState([]);
  const [traceLog, setTraceLog] = useState([]);

  const handleNewResponse = (response) => {
    if (response.seeds) {
      setActiveSeeds(response.seeds);
    }
    if (response.trace_log) {
      setTraceLog(prev => [...prev, ...response.trace_log]);
    }
  };

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <header className="relative bg-gray-900 bg-opacity-50 backdrop-blur-lg backdrop-filter border-b border-white border-opacity-20">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              EvAI
            </h1>
            <p className="text-gray-400 text-sm">
              Reflective & Explainable AI
            </p>
          </div>
          <p className="mt-2 text-gray-400 text-sm">
            Een AI systeem dat reflecteert, uitlegt en zich aanpast aan jouw profiel
          </p>
        </div>
      </header>
      <main className="relative">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <ChatInterface onNewResponse={handleNewResponse} />
        </div>
        <InsightPanel activeSeeds={activeSeeds} traceLog={traceLog} />
      </main>
    </div>
  );
}

export default App; 