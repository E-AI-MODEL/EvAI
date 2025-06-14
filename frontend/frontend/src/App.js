import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import ChatInterface from './components/ChatInterface';
import AnimatedBackground from './components/AnimatedBackground';
import InsightPanel from './components/InsightPanel';

const AppContainer = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 400px;
  grid-template-rows: auto 1fr;
  gap: 1rem;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
`;

const Header = styled(motion.header)`
  grid-column: 1 / -1;
  padding: 2rem;
  text-align: center;
  color: white;
  z-index: 1;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const Title = styled.h1`
  font-size: 3rem;
  margin: 0;
  background: linear-gradient(45deg, #3b82f6, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  letter-spacing: -0.025em;
`;

const Description = styled.p`
  font-size: 1.25rem;
  margin: 1rem 0;
  color: #94a3b8;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const MainContent = styled.main`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 1rem;
  z-index: 1;
  height: 100%;
`;

const ChatSection = styled.div`
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const InsightSection = styled.div`
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;

function App() {
  const [activeSeeds, setActiveSeeds] = useState([]);
  const [traceLog, setTraceLog] = useState([]);

  const handleNewResponse = (response) => {
    if (response.seeds) {
      setActiveSeeds(response.seeds);
    }
    if (response.trace_log) {
      setTraceLog(response.trace_log);
    }
  };

  return (
    <AppContainer>
      <AnimatedBackground />
      <Header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title>EvAI</Title>
        <Description>
          Een reflectieve en verklaarbare AI agent die zich aanpast aan jouw profiel
        </Description>
      </Header>
      <MainContent>
        <ChatSection>
          <ChatInterface onNewResponse={handleNewResponse} />
        </ChatSection>
        <InsightSection>
          <InsightPanel activeSeeds={activeSeeds} traceLog={traceLog} />
        </InsightSection>
      </MainContent>
    </AppContainer>
  );
}

export default App;
