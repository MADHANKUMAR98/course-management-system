import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';
import config from '../config';
import {
  FaStar,
  FaUserFriends,
  FaClock,
  FaPlayCircle,
  FaCheckCircle,
  FaLock,
  FaShoppingCart,
  FaArrowLeft,
  FaChevronRight,
  FaGraduationCap,
  FaCertificate,
  FaRocket,
  FaAward,
  FaGlobe,
  FaDesktop,
  FaShieldAlt,
  FaLightbulb
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const PageWrapper = styled(motion.div)`
  min-height: 100vh;
  padding: 6rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  margin-bottom: 3rem;
  padding: 0;
`;

const HeroSection = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 4rem;
  margin-bottom: 5rem;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const CourseInfo = styled.div`
  .category {
    color: ${props => props.theme.colors.primary};
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 1.5rem;
    display: block;
  }

  h1 {
    font-size: clamp(3rem, 6vw, 4.5rem);
    font-weight: 950;
    line-height: 1.1;
    margin-bottom: 2rem;
    background: ${props => props.theme.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -2px;
  }
`;

const MetaRow = styled.div`
  display: flex;
  gap: 2.5rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;
`;

const MetaBox = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};

  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 1.4rem;
  }
`;

const PreviewCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: 40px;
  border: 1px solid ${props => props.theme.colors.border};
  padding: 2.5rem;
  box-shadow: ${props => props.theme.shadows.xl};
  height: fit-content;
  position: sticky;
  top: 100px;
`;

const PreviewImage = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 25px;
  overflow: hidden;
  margin-bottom: 2.5rem;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .play-btn {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.3);
    color: white;
    font-size: 5rem;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(0,0,0,0.5);
      font-size: 5.5rem;
    }
  }
`;

const Pricing = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1.5rem;
  margin-bottom: 2rem;

  .price {
    font-size: 3.5rem;
    font-weight: 900;
    color: ${props => props.theme.colors.text};
  }

  .old-price {
    font-size: 1.5rem;
    color: ${props => props.theme.colors.textSecondary};
    text-decoration: line-through;
  }
`;

const EnrollCTA = styled(motion.button)`
  width: 100%;
  padding: 1.5rem;
  background: ${props => props.primary ? props.theme.gradients.primary : 'transparent'};
  color: ${props => props.primary ? 'white' : props.theme.colors.text};
  border: ${props => props.primary ? 'none' : `2px solid ${props.theme.colors.border}`};
  border-radius: 20px;
  font-size: 1.2rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: ${props => props.primary ? `0 20px 40px ${props.theme.colors.primary}44` : 'none'};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 5rem;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const Curriculum = styled.div`
  h2 {
    font-size: 2.5rem;
    font-weight: 900;
    margin-bottom: 3rem;
  }
`;

const ModuleCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 25px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  .num {
    width: 50px;
    height: 50px;
    background: ${props => props.theme.colors.primary}11;
    color: ${props => props.theme.colors.primary};
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 1.2rem;
  }

  .title {
    flex: 1;
    margin: 0 2rem;
    h4 { font-size: 1.3rem; font-weight: 800; margin-bottom: 0.4rem; }
    p { color: ${props => props.theme.colors.textSecondary}; font-size: 0.9rem; }
  }

  svg {
    color: ${props => props.theme.colors.textSecondary};
    font-size: 1.2rem;
  }
`;

const Sidebar = styled.div`
  section {
    margin-bottom: 4rem;
    h3 { font-size: 1.6rem; font-weight: 800; margin-bottom: 2rem; }
    ul { list-style: none; padding: 0; }
    li {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.2rem;
      font-weight: 600;
      color: ${props => props.theme.colors.textSecondary};
      svg { color: #10b981; }
    }
  }
`;

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const sampleCourses = {
    '1': {
      title: 'Quantum Computing for Architects',
      category: 'AI & ML',
      rating: 4.9,
      students: 4520,
      duration: '60 Hours',
      level: 'Advanced',
      price: 199.99,
      oldPrice: 499.00,
      instructor: 'Dr. Orion Vance',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1000&auto=format',
      description: 'Break the limitations of binary computing. This course provides a deep dive into qubits, quantum entanglement, and building algorithms that leverage quantum supremacy for architectural modeling and complex simulations.',
      modules: [
        { title: 'The Quantum Reality', lessons: '8 Lessons', duration: '12h' },
        { title: 'Superposition Algorithms', lessons: '12 Lessons', duration: '18h' },
        { title: 'Hardware Integration', lessons: '6 Lessons', duration: '10h' },
        { title: 'Future-Proofing Labs', lessons: '15 Lessons', duration: '20h' }
      ]
    },
    '2': {
      title: 'Full Stack Titan: 2024 Edition',
      category: 'Web Development',
      rating: 4.8,
      students: 12400,
      duration: '120 Hours',
      level: 'Intermediate',
      price: 89.99,
      oldPrice: 199.00,
      instructor: 'Alex Rivera',
      image: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=1000&auto=format',
      description: 'The definitive path to becoming a Senior Full Stack Engineer. We go beyond simple CRUD apps to tackle distributed systems, high-availability architecture, and the modern Bun/Next.js ecosystem.',
      modules: [
        { title: 'Advanced Next.js 14', lessons: '20 Lessons', duration: '25h' },
        { title: 'Distributed Microservices', lessons: '15 Lessons', duration: '30h' },
        { title: 'Bun & Edge Computing', lessons: '10 Lessons', duration: '15h' },
        { title: 'Production Scalability', lessons: '25 Lessons', duration: '50h' }
      ]
    },
    '3': {
      title: 'Generative AI Mastermind',
      category: 'AI & ML',
      rating: 5.0,
      students: 8200,
      duration: '45 Hours',
      level: 'Advanced',
      price: 149.50,
      oldPrice: 249.00,
      instructor: 'Sophia Chen',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1000&auto=format',
      description: 'Harness the power of Transformer models. Learn to fine-tune LLMs, build custom RAG (Retrieval-Augmented Generation) pipelines, and deploy generative image models into production-level creative workflows.',
      modules: [
        { title: 'LLM Architectures', lessons: '10 Lessons', duration: '10h' },
        { title: 'Retrieval Augmented Gen', lessons: '12 Lessons', duration: '15h' },
        { title: 'Diffusion Models Deep Dive', lessons: '8 Lessons', duration: '10h' },
        { title: 'Ethical AI Deployment', lessons: '5 Lessons', duration: '10h' }
      ]
    },
    '4': {
      title: 'Neural Design Systems',
      category: 'Design',
      rating: 4.7,
      students: 3100,
      duration: '30 Hours',
      level: 'All Levels',
      price: 75.00,
      oldPrice: 149.00,
      instructor: 'Marco Rossi',
      image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=1000&auto=format',
      description: 'Reinvent your design process. Learn how to bridge the gap between Figma and code using AI-powered automation, procedural design systems, and generative layout engines.',
      modules: [
        { title: 'Procedural UI Patterns', lessons: '8 Lessons', duration: '8h' },
        { title: 'AI-Enhanced Prototyping', lessons: '10 Lessons', duration: '12h' },
        { title: 'Automated Token Systems', lessons: '6 Lessons', duration: '5h' },
        { title: 'Neuro-UX Principles', lessons: '5 Lessons', duration: '5h' }
      ]
    },
    '5': {
      title: 'Stock Market AI Bot Trading',
      category: 'Business',
      rating: 4.9,
      students: 2840,
      duration: '85 Hours',
      level: 'Advanced',
      price: 299.00,
      oldPrice: 599.00,
      instructor: 'Gareth Bale',
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1000&auto=format',
      description: 'Build your own financial hedge fund. Use advanced transformer-based neural networks to predict market volatility, analyze thousands of real-time news articles with NLP, and deploy high-frequency bots that trade automatically across global crypto and stock exchanges.',
      modules: [
        { title: 'Quantitative Finance 101', lessons: '15 Lessons', duration: '15h' },
        { title: 'Neural Network Architectures for Time-Series', lessons: '18 Lessons', duration: '20h' },
        { title: 'NLP Sentiment Analysis for Live News', lessons: '12 Lessons', duration: '15h' },
        { title: 'Building High-Frequency Trading Engines', lessons: '25 Lessons', duration: '35h' },
        { title: 'Advanced Risk Management & Hedging', lessons: '10 Lessons', duration: '10h' }
      ]
    },
    '6': {
      title: 'Cybersecurity Sentinel',
      category: 'Programming',
      rating: 4.9,
      students: 5600,
      duration: '55 Hours',
      level: 'Intermediate',
      price: 120.00,
      oldPrice: 249.00,
      instructor: 'Sarah Connor',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1000&auto=format',
      description: 'Defend the digital frontier. Master offensive security, penetration testing, and zero-trust architecture in this elite bootcamp dedicated to modern cyber defense.',
      modules: [
        { title: 'Zero Trust Network Arch', lessons: '10 Lessons', duration: '10h' },
        { title: 'Advanced Pentesting', lessons: '20 Lessons', duration: '25h' },
        { title: 'Cryptographic Defenses', lessons: '10 Lessons', duration: '10h' },
        { title: 'Threat Hunting Ops', lessons: '8 Lessons', duration: '10h' }
      ]
    }
  };

  useEffect(() => {
    // Try to get from API, fallback to sample
    const fetch = async () => {
      try {
        const res = await axios.get(`${config.API_BASE_URL}/api/courses/${id}`);
        setCourse(res.data);
      } catch (e) {
        if (sampleCourses[id]) {
          setCourse(sampleCourses[id]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return null;

  if (!course) {
    return (
      <PageWrapper style={{ textAlign: 'center' }}>
        <FaRocket style={{ fontSize: '5rem', color: theme.colors.primary, marginBottom: '2rem' }} />
        <h1 style={{ fontSize: '3rem', fontWeight: 900 }}>Orbit Lost</h1>
        <p style={{ color: theme.colors.textSecondary, marginBottom: '3rem' }}>The course you're looking for has moved to a higher dimension or doesn't exist.</p>
        <BackButton onClick={() => navigate('/courses')}>
          <FaArrowLeft /> Back to Courses
        </BackButton>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <BackButton onClick={() => navigate(-1)} whileHover={{ x: -10 }}>
        <FaArrowLeft /> Return to Tracks
      </BackButton>

      <HeroSection>
        <CourseInfo>
          <span className="category">{course.category}</span>
          <h1>{course.title}</h1>
          <MetaRow>
            <MetaBox><FaStar /> {course.rating} Rating</MetaBox>
            <MetaBox><FaUserFriends /> {course.students.toLocaleString()} Elite Students</MetaBox>
            <MetaBox><FaClock /> {course.duration}</MetaBox>
            <MetaBox><FaAward /> {course.level}</MetaBox>
          </MetaRow>
          <p style={{ fontSize: '1.3rem', lineHeight: '1.7', color: theme.colors.textSecondary, marginBottom: '3rem', maxWidth: '800px' }}>
            {course.description}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 700, fontSize: '1.2rem' }}>
            <FaGraduationCap style={{ fontSize: '2rem', color: theme.colors.primary }} />
            Expert Instruction by {course.instructor}
          </div>
        </CourseInfo>

        <PreviewCard
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <PreviewImage>
            <img src={course.image} alt="Preview" />
            <div className="play-btn"><FaPlayCircle /></div>
          </PreviewImage>

          <Pricing>
            <span className="price">${course.price}</span>
            {course.oldPrice && <span className="old-price">${course.oldPrice}</span>}
          </Pricing>

          <EnrollCTA primary onClick={() => navigate(`/payment/${id}`)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <FaRocket /> Master This Track
          </EnrollCTA>
          <EnrollCTA onClick={() => window.scrollTo(0, 1000)} whileHover={{ scale: 1.02 }}>
            View Full Curriculum
          </EnrollCTA>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: theme.colors.textSecondary, marginTop: '1.5rem' }}>
            <FaShieldAlt /> 30-Day Money-Back Guarantee
          </p>
        </PreviewCard>
      </HeroSection>

      <ContentGrid>
        <Curriculum>
          <h2>Elite Curriculum</h2>
          {course.modules.map((m, i) => (
            <ModuleCard
              key={i}
              whileHover={{ x: 15, background: `${theme.colors.primary}05` }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="num">0{i + 1}</div>
              <div className="title">
                <h4>{m.title}</h4>
                <p>{m.lessons} • {m.duration} Total</p>
              </div>
              <FaChevronRight />
            </ModuleCard>
          ))}
        </Curriculum>

        <Sidebar>
          <section>
            <h3>What's Included</h3>
            <ul>
              <li><FaCheckCircle /> Lifetime Access to Lessons</li>
              <li><FaDesktop /> Mobile & Desktop Optimized</li>
              <li><FaAward /> Professional Certificate</li>
              <li><FaGlobe /> Global Community Access</li>
              <li><FaLightbulb /> 25+ Downloadable Resources</li>
            </ul>
          </section>

          <section>
            <h3>Prerequisites</h3>
            <p style={{ color: theme.colors.textSecondary, lineHeight: '1.6', fontWeight: 500 }}>
              {course.level === 'Advanced'
                ? 'Strong foundation in engineering principles and mathematical logic required.'
                : 'No prior experience needed - we start from the absolute fundamentals.'}
            </p>
          </section>
        </Sidebar>
      </ContentGrid>
    </PageWrapper>
  );
}

export default CourseDetail;