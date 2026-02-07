import React from 'react';
import styled, { keyframes } from 'styled-components';

const move = keyframes`
  0% { transform: translate(0, 0); }
  25% { transform: translate(100px, 50px); }
  50% { transform: translate(50px, 100px); }
  75% { transform: translate(-50px, 50px); }
  100% { transform: translate(0, 0); }
`;

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  background: ${props => props.theme.colors.background};
`;

const Blob = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.color};
  filter: blur(${props => props.blur}px);
  border-radius: 50%;
  opacity: 0.15;
  animation: ${move} ${props => props.duration}s infinite linear;
`;

const AnimatedBackground = () => {
    return (
        <BackgroundContainer>
            <Blob size={600} color="#6366f1" blur={100} duration={25} style={{ top: '-10%', left: '-10%' }} />
            <Blob size={500} color="#a855f7" blur={100} duration={30} style={{ bottom: '10%', right: '0%' }} />
            <Blob size={400} color="#ec4899" blur={120} duration={20} style={{ top: '20%', right: '20%' }} />
            <Blob size={300} color="#06b6d4" blur={80} duration={15} style={{ bottom: '20%', left: '20%' }} />
        </BackgroundContainer>
    );
};

export default AnimatedBackground;
