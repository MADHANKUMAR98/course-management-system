import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaGraduationCap, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaHeart, FaPaperPlane } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const FooterContainer = styled(motion.footer)`
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  padding: 8rem 2rem 4rem;
  margin-top: auto;
  border-top: 1px solid ${props => props.theme.colors.border};
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem 2rem;
  }
`;

const FooterContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 4rem;
  margin-bottom: 5rem;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FooterSection = styled.div`
  h3 {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    color: ${props => props.theme.colors.primary};
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 800;
  }

  p {
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.8;
    margin-bottom: 1.5rem;
  }
`;

const NewsletterBox = styled.div`
  display: flex;
  margin-top: 1.5rem;
  background: ${props => props.theme.colors.background};
  padding: 0.5rem;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  
  input {
    background: transparent;
    border: none;
    padding: 0.8rem;
    color: ${props => props.theme.colors.text};
    flex: 1;
    outline: none;
    font-size: 0.9rem;
  }

  button {
    background: ${props => props.theme.colors.primary};
    color: white;
    border: none;
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
      opacity: 0.9;
      transform: scale(1.05);
    }
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  a {
    color: ${props => props.theme.colors.textSecondary};
    text-decoration: none;
    transition: all 0.3s ease;
    font-weight: 500;

    &:hover {
      color: ${props => props.theme.colors.primary};
      transform: translateX(8px);
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1.2rem;
  margin-top: 2rem;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 45px;
    background: ${props => props.theme.colors.background};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 12px;
    color: ${props => props.theme.colors.textSecondary};
    font-size: 1.2rem;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

    &:hover {
      background: ${props => props.theme.colors.primary};
      color: white;
      transform: translateY(-5px) rotate(10deg);
      border-color: ${props => props.theme.colors.primary};
    }
  }
`;

const FooterBottom = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding-top: 3rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;

  @media (max-width: 768px) {
    justify-content: center;
    text-align: center;
  }
`;

const Copyright = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    color: #ff4757;
    animation: HeartBeat 1.5s infinite;
  }

  @keyframes HeartBeat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
`;

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <FooterContent>
        <FooterSection>
          <h3>
            <FaGraduationCap />
            EduMaster
          </h3>
          <p>
            The world's leading educational platform powered by elite instructors and cutting-edge technology.
            Join the collective of knowledge-seekers and builders of tomorrow.
          </p>
          <SocialLinks>
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <h3>Platform</h3>
          <FooterLinks>
            <a href="/courses">All Courses</a>
            <a href="/leaderboard">Leaderboard</a>
            <a href="/dashboard">Study Plan</a>
            <a href="/profile">My Account</a>
            <a href="/">Teach on EduMaster</a>
          </FooterLinks>
        </FooterSection>

        <FooterSection>
          <h3>Categories</h3>
          <FooterLinks>
            <a href="/courses">Artificial Intelligence</a>
            <a href="/courses">Full Stack Dev</a>
            <a href="/courses">Blockchain Tech</a>
            <a href="/courses">Machine Learning</a>
            <a href="/courses">Quant Finance</a>
          </FooterLinks>
        </FooterSection>

        <FooterSection>
          <h3>Elevate Your Inbox</h3>
          <p>Get the latest world-class insights and course launches directly in your mail.</p>
          <NewsletterBox>
            <input type="email" placeholder="Enter your business email" />
            <button aria-label="Subscribe">
              <FaPaperPlane />
            </button>
          </NewsletterBox>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <Copyright>
          © {currentYear} EduMaster Global LLC. Crafted with <FaHeart /> for excellence.
        </Copyright>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Cookies</a>
        </div>
      </FooterBottom>
    </FooterContainer>
  );
}

export default Footer;