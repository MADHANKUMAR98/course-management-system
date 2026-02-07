import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import styled from 'styled-components';
import {
  FaGraduationCap,
  FaLaptopCode,
  FaChartLine,
  FaUsers,
  FaRocket,
  FaPlay,
  FaAward,
  FaGlobeAmericas,
  FaArrowRight,
  FaCheckCircle,
  FaLightbulb,
  FaFire,
  FaJava,
  FaReact,
  FaNodeJs,
  FaPython,
  FaDocker,
  FaAws,
  FaComments
} from 'react-icons/fa';
import { SiTensorflow, SiNextdotjs, SiTypescript, SiFigma } from 'react-icons/si';
import { useTheme } from '../context/ThemeContext';

const PageWrapper = styled(motion.div)`
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  overflow-x: hidden;
`;

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 6rem;
  overflow: hidden;

  @media (max-width: 1024px) {
    padding: 10rem 2rem 6rem;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    min-height: auto;
    gap: 4rem;
  }
`;

const FloatingElement = styled(motion.div)`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.gradient};
  border-radius: ${props => props.radius || '50%'};
  filter: blur(${props => props.blur}px);
  z-index: 0;
  opacity: 0.3;
  pointer-events: none;
`;

const HeroContent = styled(motion.div)`
  flex: 1.2;
  z-index: 2;
  position: relative;
`;

const Badge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: ${props => props.theme.colors.glass};
  backdrop-filter: blur(15px);
  border: 1px solid ${props => props.theme.colors.glassBorder};
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 2.5rem;
  text-transform: uppercase;
  box-shadow: ${props => props.theme.shadows.sm};
`;

const Title = styled(motion.h1)`
  font-size: clamp(3.5rem, 8vw, 7rem);
  font-weight: 950;
  line-height: 0.95;
  margin-bottom: 2rem;
  letter-spacing: -2px;
  color: ${props => props.theme.colors.text};
  
  span {
    display: inline-block;
    background: ${props => props.theme.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    padding-bottom: 0.1em;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.textSecondary};
  max-width: 650px;
  margin-bottom: 3.5rem;
  line-height: 1.7;
  font-weight: 400;

  @media (max-width: 1024px) {
    margin: 0 auto 3.5rem;
  }
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 1024px) {
    justify-content: center;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const PrimaryButton = styled(motion(Link))`
  padding: 1.4rem 3rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  font-size: 1.1rem;
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.4);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent);
    transform: rotate(45deg);
    transition: 0.5s;
  }

  &:hover::after {
    left: 100%;
  }
`;

const SecondaryButton = styled(motion.button)`
  padding: 1.4rem 3rem;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  font-size: 1.1rem;
  box-shadow: ${props => props.theme.shadows.md};
`;

const HeroImageContainer = styled(motion.div)`
  flex: 0.8;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;

  @media (max-width: 1024px) {
    margin-top: 6rem;
    width: 100%;
  }
`;

const MainImageWrapper = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 550px;
  border-radius: 40px;
  padding: 10px;
  background: ${props => props.theme.colors.glass};
  border: 1px solid ${props => props.theme.colors.glassBorder};
  backdrop-filter: blur(10px);
  box-shadow: ${props => props.theme.shadows.xl};
  transform-style: preserve-3d;

  img {
    width: 100%;
    border-radius: 35px;
    display: block;
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const StatsSection = styled.section`
  padding: 8rem 4rem;
  background: transparent;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3rem;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  
  .number {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 950;
    margin-bottom: 0.5rem;
    background: ${props => props.theme.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .label {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.textSecondary};
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

const InteractiveSteps = styled.section`
  padding: 10rem 4rem;
  text-align: center;

  @media (max-width: 768px) {
    padding: 6rem 1.5rem;
  }
`;

const StepGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4rem;
  max-width: 1200px;
  margin: 6rem auto 0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 30%;
    left: 10%;
    right: 10%;
    height: 2px;
    background: ${props => props.theme.colors.border};
    z-index: 0;

    @media (max-width: 1024px) {
      display: none;
    }
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const StepItem = styled(motion.div)`
  position: relative;
  z-index: 1;

  .step-num {
    width: 60px;
    height: 60px;
    background: ${props => props.theme.colors.primary};
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 900;
    margin: 0 auto 2rem;
    box-shadow: 0 10px 20px rgba(99, 102, 241, 0.4);
  }

  h3 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }

  p {
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.6;
  }
`;

const FloatingIcon = styled(motion.div)`
  position: absolute;
  font-size: 2.5rem;
  color: ${props => props.color};
  filter: drop-shadow(0 0 10px ${props => props.color}44);
  z-index: 3;
`;

const MarqueeSection = styled.div`
  padding: 4rem 0;
  background: ${props => props.theme.colors.surface};
  overflow: hidden;
  border-top: 1px solid ${props => props.theme.colors.border};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const MarqueeTrack = styled(motion.div)`
  display: flex;
  gap: 5rem;
  width: max-content;
  align-items: center;
`;

const MarqueeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.5rem;
  font-weight: 800;
  color: ${props => props.theme.colors.textSecondary};
  opacity: 0.6;
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
    color: ${props => props.theme.colors.primary};
  }
`;

const LiveChatBubble = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 65px;
  height: 65px;
  background: ${props => props.theme.gradients.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
`;

const AnimatedCounter = ({ value, label }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value.replace(/\D/g, ""));
      if (start === end) return;

      let totalMiliseconds = 2000;
      let incrementTime = (totalMiliseconds / end);

      let timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <StatCard ref={nodeRef}>
      <div className="number">{count}{value.includes('+') ? '+' : value.includes('%') ? '%' : ''}</div>
      <div className="label">{label}</div>
    </StatCard>
  );
};

function Home() {
  const { theme } = useTheme();
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const mouseX = useSpring(0, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(0, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth) - 0.5);
    mouseY.set((clientY / innerHeight) - 0.5);
  };

  const imageRotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const imageRotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

  return (
    <PageWrapper
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <HeroSection ref={targetRef}>
        <FloatingElement
          size={500}
          gradient={theme.gradients.primary}
          blur={100}
          style={{ top: '-10%', right: '-5%' }}
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <FloatingElement
          size={400}
          gradient={theme.gradients.secondary}
          blur={120}
          style={{ bottom: '10%', left: '-5%' }}
          animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        <HeroContent>
          <Badge
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FaAward /> Excellence in Digital Education
          </Badge>

          <Title>
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Learn.
            </motion.span>
            <br />
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Build.
            </motion.span>
            <br />
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              style={{ color: '#6366f1' }}
            >
              Succeed.
            </motion.span>
          </Title>

          <Description
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Access world-class curriculum curated by silicon valley veterans.
            Bridge the gap between theory and industry-grade implementation.
          </Description>

          <ButtonGroup
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <PrimaryButton to="/courses" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              View Curriculum <FaArrowRight />
            </PrimaryButton>
            <SecondaryButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <FaPlay /> Roadmap 2024
            </SecondaryButton>
          </ButtonGroup>
        </HeroContent>

        <HeroImageContainer>
          <MainImageWrapper
            style={{
              rotateX: imageRotateX,
              rotateY: imageRotateY,
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1000&auto=format"
              alt="Elite Education"
            />

            <FloatingIcon
              color="#fbbf24"
              style={{ top: '10%', right: '-30px' }}
              animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <FaLightbulb />
            </FloatingIcon>

            <FloatingIcon
              color="#ef4444"
              style={{ bottom: '20%', left: '-40px' }}
              animate={{ y: [0, 15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <FaFire />
            </FloatingIcon>

            <motion.div
              style={{
                position: 'absolute',
                top: '-20px',
                left: '-20px',
                padding: '1rem',
                background: theme.colors.surface,
                borderRadius: '15px',
                boxShadow: theme.shadows.md,
                border: `1px solid ${theme.colors.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                zIndex: 4
              }}
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              <FaCheckCircle color="#10b981" />
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Project Based</div>
            </motion.div>
          </MainImageWrapper>
        </HeroImageContainer>
      </HeroSection>

      <MarqueeSection>
        <MarqueeTrack
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[1, 2].map((group) => (
            <React.Fragment key={group}>
              <MarqueeItem><FaReact /> React.js</MarqueeItem>
              <MarqueeItem><SiNextdotjs /> Next.js 14</MarqueeItem>
              <MarqueeItem><SiTypescript /> TypeScript</MarqueeItem>
              <MarqueeItem><FaNodeJs /> Node.js</MarqueeItem>
              <MarqueeItem><FaPython /> Python AI</MarqueeItem>
              <MarqueeItem><SiTensorflow /> TensorFlow</MarqueeItem>
              <MarqueeItem><FaDocker /> Docker</MarqueeItem>
              <MarqueeItem><FaAws /> AWS Cloud</MarqueeItem>
              <MarqueeItem><SiFigma /> UI Design</MarqueeItem>
              <MarqueeItem><FaJava /> Enterprise Java</MarqueeItem>
            </React.Fragment>
          ))}
        </MarqueeTrack>
      </MarqueeSection>

      <StatsSection>
        <StatsGrid>
          <AnimatedCounter value="120+" label="Expert Mentors" />
          <AnimatedCounter value="45K+" label="Global Alumni" />
          <AnimatedCounter value="150+" label="Syllabus Hours" />
          <AnimatedCounter value="98%" label="Job Placement" />
        </StatsGrid>
      </StatsSection>

      <InteractiveSteps>
        <Badge>HOW IT WORKS</Badge>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 950, marginTop: '1rem' }}>Your Pathway to <span>Mastery</span></h2>

        <StepGrid>
          <StepItem
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="step-num">01</div>
            <h3>Choose Domain</h3>
            <p>Select from over 50 specialized tracks designed for modern-day careers.</p>
          </StepItem>

          <StepItem
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="step-num">02</div>
            <h3>Build Projects</h3>
            <p>Every lesson concludes with a hands-on project that goes into your portfolio.</p>
          </StepItem>

          <StepItem
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className="step-num">03</div>
            <h3>Get Certified</h3>
            <p>Receive an NFT-verified certificate recognized by global industry leaders.</p>
          </StepItem>
        </StepGrid>
      </InteractiveSteps>

      <section style={{ padding: 'clamp(4rem, 8vw, 8rem) 1.5rem', background: 'transparent' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <Badge>FEATURED TRACKS</Badge>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 950, color: theme.colors.text }}>Master the <span>Most in-demand</span> Skills</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))',
          gap: '2.5rem',
          maxWidth: '1300px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          {[
            { title: 'Full Stack Mastery', color: '#6366f1', icon: <FaLaptopCode />, price: '$49.99' },
            { title: 'AI & Machine Learning', color: '#10b981', icon: <FaRocket />, price: '$59.99' },
            { title: 'UI/UX Excellence', color: '#f59e0b', icon: <FaLightbulb />, price: '$39.99' }
          ].map((course, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -15, rotateX: 5, rotateY: 5 }}
              style={{
                background: theme.colors.surface,
                borderRadius: '30px',
                padding: '3rem',
                border: `1px solid ${theme.colors.border}`,
                boxShadow: theme.shadows.lg,
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '70px',
                height: '70px',
                background: `${course.color}22`,
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                color: course.color,
                marginBottom: '2rem'
              }}>
                {course.icon}
              </div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{course.title}</h3>
              <p style={{ color: theme.colors.textSecondary, marginBottom: '2rem' }}>Comprehensive curriculum from beginner to advanced levels.</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: theme.colors.primary }}>{course.price}</span>
                <Link to="/courses" style={{ color: theme.colors.primary, fontWeight: 700, textDecoration: 'none' }}>Learn More →</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ padding: 'clamp(4rem, 8vw, 8rem) 1.5rem', textAlign: 'center' }}>
        <Badge>REVIEWS</Badge>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 950, margin: '1rem 0 5rem' }}>Success Stories from <span>Our Graduates</span></h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))',
          gap: '2.5rem',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          {[
            { name: 'Sarah J.', role: 'Eng at Google', text: 'The project-based learning changed my life. I had a portfolio before I even finished.' },
            { name: 'Marcus L.', role: 'Startup Founder', text: 'The elite curriculum is truly silicon valley grade. Best investment I ever made.' }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              style={{
                background: theme.colors.glass,
                padding: '3rem',
                borderRadius: '40px',
                maxWidth: '500px',
                textAlign: 'left',
                border: `1px solid ${theme.colors.glassBorder}`,
                backdropFilter: 'blur(10px)'
              }}
            >
              <div style={{ fontSize: '3rem', color: theme.colors.primary, marginBottom: '1rem', opacity: 0.3 }}>"</div>
              <p style={{ fontSize: '1.2rem', lineHeight: 1.6, marginBottom: '2rem', fontStyle: 'italic' }}>{item.text}</p>
              <div style={{ fontWeight: 800 }}>{item.name}</div>
              <div style={{ color: theme.colors.textSecondary, fontSize: '0.9rem' }}>{item.role}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <motion.section
        style={{
          padding: 'clamp(6rem, 15vw, 10rem) 1.5rem',
          background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=2000")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          borderRadius: window.innerWidth > 768 ? '100px 100px 0 0' : '50px 50px 0 0'
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 950, marginBottom: '2.5rem', letterSpacing: '-2px' }}>
            Ready to Build the <span>Next Big Thing?</span>
          </h2>
          <p style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)', marginBottom: '4rem', opacity: 0.9, lineHeight: 1.6 }}>
            The best time to start was yesterday. The second best time is now.
            Join 45,000+ others today.
          </p>
          <PrimaryButton
            to="/register"
            style={{ background: 'white', color: theme.colors.primary, margin: '0 auto', maxWidth: '350px' }}
            whileHover={{ scale: 1.1, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
            whileTap={{ scale: 0.9 }}
          >
            Create My Career Account
          </PrimaryButton>
        </div>
      </motion.section>
      <LiveChatBubble
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: 'spring' }}
      >
        <FaComments />
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 15,
            height: 15,
            background: '#ff4757',
            borderRadius: '50%',
            border: '2px solid white'
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </LiveChatBubble>
    </PageWrapper>
  );
}

export default Home;