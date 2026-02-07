import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useSpring } from 'framer-motion';

const ProgressBar = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2, #ff7e5f);
  transform-origin: 0%;
  z-index: 2000;
`;

const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return <ProgressBar style={{ scaleX }} />;
};

export default ScrollProgress;
