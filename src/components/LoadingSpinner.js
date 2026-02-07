import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

const Spinner = styled(motion.div)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid rgba(102, 126, 234, 0.1);
  border-top-color: #667eea;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #764ba2;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const DotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  width: 60px;
  height: 60px;
`;

const Dot = styled(motion.div)`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(45deg, #667eea, #764ba2);
`;

const PulseRing = styled(motion.div)`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid #667eea;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    border: 4px solid transparent;
    border-top-color: #764ba2;
    animation: spin 1s linear infinite;
  }
`;

const ShimmerCard = styled(motion.div)`
  width: 300px;
  height: 200px;
  background: linear-gradient(90deg, 
    rgba(255,255,255,0) 0%, 
    rgba(255,255,255,0.4) 50%, 
    rgba(255,255,255,0) 100%);
  background-size: 200% 100%;
  border-radius: 20px;
  animation: shimmer 1.5s infinite;
`;

export const LoadingSpinner = ({ type = 'spinner' }) => {
  const renderSpinner = () => {
    switch(type) {
      case 'dots':
        return (
          <DotGrid>
            {[...Array(9)].map((_, i) => (
              <Dot
                key={i}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </DotGrid>
        );
      
      case 'pulse':
        return (
          <PulseRing
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        );
      
      case 'shimmer':
        return <ShimmerCard />;
      
      default:
        return <Spinner animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />;
    }
  };

  return (
    <SpinnerContainer>
      {renderSpinner()}
    </SpinnerContainer>
  );
};

export const PageLoader = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  }}>
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
      style={{
        fontSize: '4rem',
        color: 'white',
        marginBottom: '2rem'
      }}
    >
      🎓
    </motion.div>
    <motion.h1
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      style={{ color: 'white', marginBottom: '1rem' }}
    >
      EduMaster
    </motion.h1>
    <LoadingSpinner type="pulse" />
  </div>
);