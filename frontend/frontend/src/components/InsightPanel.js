import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

const Panel = styled(motion.div)`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  color: #e2e8f0;
  overflow-y: auto;
  position: relative;

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

const Section = styled.div`
  background: rgba(15, 23, 42, 0.8);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    background: rgba(15, 23, 42, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.2);
  }
`;

const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  background: linear-gradient(45deg, #3b82f6, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
`;

const SeedVisualization = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  margin-bottom: 1rem;
`;

const SeedCircle = styled(motion.circle)`
  fill: url(#seedGradient);
  stroke: ${props => props.color};
  stroke-width: 2;
  transition: all 0.3s ease;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  
  &:hover {
    stroke-width: 3;
    filter: brightness(1.2) drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2));
  }
`;

const SeedText = styled.text`
  font-size: 0.9rem;
  font-weight: 600;
  fill: #e2e8f0;
  text-anchor: middle;
`;

const SeedDescription = styled.text`
  font-size: 0.8rem;
  fill: #94a3b8;
  text-anchor: middle;
`;

const LogList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const LogEntry = styled(motion.div)`
  background: rgba(15, 23, 42, 0.8);
  border-radius: 0.8rem;
  padding: 1rem;
  font-size: 0.9rem;
  font-family: 'Fira Code', monospace;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(15, 23, 42, 0.9);
    transform: translateX(5px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const GlassButton = styled(motion.button)`
  padding: 0.9rem 1.6rem;
  border-radius: 1.2rem;
  background: linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.25) 100%);
  color: #e0e7ff;
  font-weight: 600;
  border: 1.5px solid rgba(139,92,246,0.25);
  box-shadow: 0 4px 24px 0 rgba(139,92,246,0.15);
  backdrop-filter: blur(8px);
  transition: all 0.3s cubic-bezier(.4,0,.2,1);
  cursor: pointer;
  font-size: 1rem;
  outline: none;
  position: relative;
  z-index: 2;
  &:hover {
    background: linear-gradient(135deg, rgba(139,92,246,0.35) 0%, rgba(99,102,241,0.35) 100%);
    color: #fff;
    box-shadow: 0 8px 32px 0 rgba(139,92,246,0.25);
    border-color: #a78bfa;
    transform: translateY(-2px) scale(1.04);
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(30, 41, 59, 0.7);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled(motion.div)`
  background: rgba(30, 27, 75, 0.95);
  border-radius: 1.5rem;
  padding: 2.5rem 2rem;
  min-width: 340px;
  max-width: 90vw;
  color: #e0e7ff;
  box-shadow: 0 8px 32px 0 rgba(139,92,246,0.25);
  border: 1.5px solid #a78bfa;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #a78bfa;
  font-size: 1.5rem;
  cursor: pointer;
`;

const FeedbackTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  border-radius: 0.8rem;
  border: 1px solid #a78bfa;
  background: rgba(139,92,246,0.08);
  color: #e0e7ff;
  padding: 1rem;
  font-size: 1rem;
  margin-bottom: 1.2rem;
  resize: vertical;
`;

const InsightPanel = ({ activeSeeds, traceLog }) => {
  const [showSeedFeedback, setShowSeedFeedback] = useState(false);
  const [showLIM, setShowLIM] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const colors = {
    core: '#3b82f6',      // Blue
    direction: '#10b981', // Green
    warning: '#f59e0b',   // Yellow
    inspiration: '#ef4444', // Red
    meta: '#8b5cf6'       // Purple
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    // TODO: connect to backend for feedback
    setFeedbackSent(true);
    setTimeout(() => {
      setShowSeedFeedback(false);
      setFeedback('');
      setFeedbackSent(false);
    }, 1200);
  };

  return (
    <Panel
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <svg width="0" height="0">
        <defs>
          <linearGradient id="seedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0.1)" />
          </linearGradient>
        </defs>
      </svg>

      <ButtonRow>
        <GlassButton
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowSeedFeedback(true)}
        >
          Seed Feedback
        </GlassButton>
        <GlassButton
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowLIM(true)}
        >
          LIM
        </GlassButton>
      </ButtonRow>

      <Section>
        <SectionTitle>Actieve Seeds</SectionTitle>
        <SeedVisualization>
          <svg viewBox="0 0 300 200" width="100%" height="100%">
            {activeSeeds.map((seed, index) => {
              const angle = (index * 2 * Math.PI) / activeSeeds.length;
              const x = 150 + 100 * Math.cos(angle);
              const y = 100 + 100 * Math.sin(angle);
              const type = seed.type || 'core';
              
              return (
                <g key={index}>
                  <SeedCircle
                    cx={x}
                    cy={y}
                    r="40"
                    color={colors[type]}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                  <SeedText x={x} y={y - 5}>
                    {seed.type || 'Core'}
                  </SeedText>
                  <SeedDescription x={x} y={y + 15}>
                    {seed.intention_nl || seed.intention_en}
                  </SeedDescription>
                </g>
              );
            })}
          </svg>
        </SeedVisualization>
      </Section>

      <Section>
        <SectionTitle>Trace Log</SectionTitle>
        <LogList>
          {traceLog.map((log, index) => (
            <LogEntry
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {log}
            </LogEntry>
          ))}
        </LogList>
      </Section>

      <AnimatePresence>
        {showSeedFeedback && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <CloseButton onClick={() => setShowSeedFeedback(false)}>&times;</CloseButton>
              <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: '1rem', color: '#a78bfa' }}>Seed Feedback</h2>
              <form onSubmit={handleFeedbackSubmit}>
                <FeedbackTextarea
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  placeholder="Geef je feedback op de actieve seeds..."
                  disabled={feedbackSent}
                />
                <GlassButton
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={feedbackSent || !feedback.trim()}
                  style={{ width: '100%' }}
                >
                  {feedbackSent ? 'Verzonden!' : 'Verstuur Feedback'}
                </GlassButton>
              </form>
            </ModalContent>
          </ModalOverlay>
        )}
        {showLIM && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <CloseButton onClick={() => setShowLIM(false)}>&times;</CloseButton>
              <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: '1rem', color: '#a78bfa' }}>LIM (Legitimate Influence Mechanisms)</h2>
              <p style={{ color: '#e0e7ff', marginBottom: '1rem' }}>
                LIM zijn mechanismen waarmee de AI uitlegbaar en controleerbaar blijft. Ze zorgen ervoor dat de AI zich aan ethische en transparante kaders houdt, en dat jij als gebruiker altijd invloed hebt op het leer- en redeneerproces.
              </p>
              <ul style={{ color: '#c4b5fd', fontSize: '1rem', marginBottom: '1rem', paddingLeft: '1.2rem' }}>
                <li>• Transparantie over gebruikte seeds</li>
                <li>• Mogelijkheid tot feedback op reasoning</li>
                <li>• Uitlegbaarheid van beslissingen</li>
                <li>• Mogelijkheid tot correctie en sturing</li>
              </ul>
              <GlassButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowLIM(false)}
                style={{ width: '100%' }}
              >
                Sluiten
              </GlassButton>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Panel>
  );
};

export default InsightPanel; 