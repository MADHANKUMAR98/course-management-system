import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const ConfettiContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
`;

const ConfettiPiece = styled(motion.div)`
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: ${props => props.shape === 'circle' ? '50%' : '2px'};
  background: ${props => props.color};
  top: -20px;
`;

const colors = [
  '#667eea', '#764ba2', '#ff7e5f', '#feb47b', 
  '#2ed573', '#1e90ff', '#ffa502', '#ff4757'
];

const shapes = ['circle', 'square', 'rectangle'];

function Confetti({ trigger, onComplete }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (trigger) {
      const newPieces = Array.from({ length: 150 }, (_, i) => ({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        left: Math.random() * 100,
        duration: 1 + Math.random() * 2,
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360
      }));
      
      setPieces(newPieces);
      
      // Clear after animation
      setTimeout(() => {
        setPieces([]);
        onComplete && onComplete();
      }, 3000);
    }
  }, [trigger, onComplete]);

  return (
    <ConfettiContainer>
      {pieces.map(piece => (
        <ConfettiPiece
          key={piece.id}
          color={piece.color}
          shape={piece.shape}
          initial={{ 
            x: `${piece.left}vw`,
            y: -20,
            rotate: 0,
            scale: 0
          }}
          animate={{ 
            y: '100vh',
            rotate: piece.rotation,
            scale: [0, 1, 0.5, 0]
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "easeOut"
          }}
          style={{
            left: `${piece.left}vw`,
            transform: `rotate(${piece.rotation}deg)`
          }}
        />
      ))}
    </ConfettiContainer>
  );
}

export default Confetti;