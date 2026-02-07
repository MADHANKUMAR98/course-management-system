import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';
import {
  FaSearch,
  FaFilter,
  FaStar,
  FaUserFriends,
  FaClock,
  FaPlayCircle,
  FaChevronDown,
  FaChevronUp,
  FaSortAmountDown,
  FaFire,
  FaRocket,
  FaAward
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const CoursesContainer = styled(motion.div)`
  padding: 4rem 2rem;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 5rem;

  h1 {
    font-size: clamp(2.5rem, 8vw, 4.5rem);
    font-weight: 950;
    margin-bottom: 1.5rem;
    background: ${props => props.theme.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -2px;
  }

  p {
    color: ${props => props.theme.colors.textSecondary};
    font-size: clamp(1rem, 3vw, 1.4rem);
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    margin-bottom: 3rem;
  }
`;

const SearchAndFilter = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: 2.5rem;
  border-radius: 30px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.xl};
  margin-bottom: 4rem;
  backdrop-filter: blur(20px);

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 20px;
    margin-bottom: 2rem;
  }
`;

const SearchBar = styled.div`
  position: relative;
  margin-bottom: 2.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1.5rem 4rem 1.5rem 2rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  font-size: 1.1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 5px ${props => props.theme.colors.primary}22;
    transform: translateY(-2px);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.primary};
  font-size: 1.5rem;
`;

const ControlsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
`;

const Filters = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const FilterButton = styled(motion.button)`
  padding: 0.8rem 1.8rem;
  border: 2px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  border-radius: 15px;
  color: ${props => props.active ? 'white' : props.theme.colors.textSecondary};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.8rem;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => !props.active && props.theme.colors.primary};
  }
`;

const CoursesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 400px), 1fr));
  gap: 3rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

const CourseCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: 30px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.border};
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const CourseImage = styled.div`
  height: 240px;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.8) 100%);
  }

  ${CourseCard}:hover & img {
    transform: scale(1.1) rotate(1deg);
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  padding: 0.5rem 1.2rem;
  background: ${props => props.color || props.theme.colors.primary};
  color: white;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 800;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
`;

const CourseContent = styled.div`
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const CourseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Category = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: 800;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 700;
  color: #fbbf24;
`;

const CourseTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.3;
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.95rem;
  font-weight: 500;

  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const CourseFooter = styled.div`
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PriceTag = styled.div`
  .currency {
    font-size: 1rem;
    font-weight: 600;
    color: ${props => props.theme.colors.textSecondary};
  }
  .amount {
    font-size: 2rem;
    font-weight: 900;
    color: ${props => props.theme.colors.text};
  }
`;

const ViewButton = styled(motion(Link))`
  padding: 1.2rem 2.5rem;
  background: ${props => props.theme.gradients.primary};
  color: white;
  border-radius: 15px;
  text-decoration: none;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 20px ${props => props.theme.colors.primary}44;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 5rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.5rem;
`;

function Courses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = ['all', 'Web Development', 'AI & ML', 'Data Science', 'Design', 'Business'];

  const sampleCourses = [
    {
      id: '1',
      title: 'Quantum Computing for Architects',
      description: 'Master the next era of computing with elite hands-on laboratories.',
      instructor: 'Dr. Orion Vance',
      price: 199.99,
      category: 'AI & ML',
      rating: 4.9,
      students: 4500,
      duration: '60h',
      level: 'Advanced',
      badge: 'Bestseller',
      badgeColor: '#ef4444',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format'
    },
    {
      id: '2',
      title: 'Full Stack Titan: 2024 Edition',
      description: 'The definitive guide to Next.js 14, Bun, and distributed systems.',
      instructor: 'Alex Rivera',
      price: 89.99,
      category: 'Web Development',
      rating: 4.8,
      students: 12400,
      duration: '120h',
      level: 'Intermediate',
      badge: 'Updated',
      badgeColor: '#10b981',
      image: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800&auto=format'
    },
    {
      id: '3',
      title: 'Generative AI Mastermind',
      description: 'Build your own LLMs and integrate stable diffusion into production.',
      instructor: 'Sophia Chen',
      price: 149.50,
      category: 'AI & ML',
      rating: 5.0,
      students: 8200,
      duration: '45h',
      level: 'Advanced',
      badge: 'Trending',
      badgeColor: '#f59e0b',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format'
    },
    {
      id: '4',
      title: 'Neural Design Systems',
      description: 'Using AI to generate high-performance user interfaces automatically.',
      instructor: 'Marco Rossi',
      price: 75.00,
      category: 'Design',
      rating: 4.7,
      students: 3100,
      duration: '30h',
      level: 'All Levels',
      image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format'
    },
    {
      id: '5',
      title: 'Stock Market AI Bot Trading',
      description: 'Algorithmic trading strategies powered by real-time neural networks.',
      instructor: 'Gareth Bale',
      price: 299.00,
      category: 'Business',
      rating: 4.6,
      students: 1500,
      duration: '80h',
      level: 'Advanced',
      badge: 'Elite',
      badgeColor: '#6366f1',
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format'
    },
    {
      id: '6',
      title: 'Cybersecurity Sentinel',
      description: 'Ethical hacking and defensive architecture for global networks.',
      instructor: 'Sarah Connor',
      price: 120.00,
      category: 'Programming',
      rating: 4.9,
      students: 5600,
      duration: '55h',
      level: 'Intermediate',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format'
    }
  ];

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setCourses(sampleCourses);
      setFilteredCourses(sampleCourses);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    let result = courses.filter(c =>
      (activeFilter === 'all' || c.category === activeFilter) &&
      (c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCourses(result);
  }, [searchTerm, activeFilter, courses]);

  return (
    <CoursesContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header>
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Elite Learning Tracks
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Chosen by over 500,000 professionals worldwide for breakthrough careers.
        </motion.p>
      </Header>

      <SearchAndFilter>
        <SearchBar>
          <SearchInput
            placeholder="What do you want to master today? (e.g., Quantum Computing, Next.js)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon><FaSearch /></SearchIcon>
        </SearchBar>

        <ControlsRow>
          <Filters>
            {categories.map((cat, i) => (
              <FilterButton
                key={cat}
                active={activeFilter === cat}
                onClick={() => setActiveFilter(cat)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {cat === 'all' && <FaRocket />}
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </FilterButton>
            ))}
          </Filters>
          <div style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
            Showing {filteredCourses.length} world-class results
          </div>
        </ControlsRow>
      </SearchAndFilter>

      <AnimatePresence mode="popLayout">
        <CoursesGrid>
          {filteredCourses.map((course, idx) => (
            <CourseCard
              key={course.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ y: -15, boxShadow: '0 30px 60px rgba(0,0,0,0.15)' }}
            >
              {course.badge && <Badge color={course.badgeColor}>{course.badge}</Badge>}
              <CourseImage>
                <img src={course.image} alt={course.title} />
              </CourseImage>

              <CourseContent>
                <CourseHeader>
                  <Category>{course.category}</Category>
                  <Rating><FaStar /> {course.rating}</Rating>
                </CourseHeader>

                <CourseTitle>{course.title}</CourseTitle>

                <MetaGrid>
                  <MetaItem><FaUserFriends /> {course.students.toLocaleString()} Students</MetaItem>
                  <MetaItem><FaClock /> {course.duration}</MetaItem>
                  <MetaItem><FaRocket /> {course.level}</MetaItem>
                  <MetaItem><FaAward /> Verified</MetaItem>
                </MetaGrid>

                <CourseFooter>
                  <PriceTag>
                    <span className="currency">$</span>
                    <span className="amount">{course.price.toString().split('.')[0]}</span>
                    <span className="currency">.{course.price.toFixed(2).split('.')[1]}</span>
                  </PriceTag>
                  <ViewButton to={`/courses/${course.id}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    Master Now
                  </ViewButton>
                </CourseFooter>
              </CourseContent>
            </CourseCard>
          ))}
        </CoursesGrid>
      </AnimatePresence>

      {filteredCourses.length === 0 && !loading && (
        <EmptyState>No elite courses found matching your criteria. Try another keyword.</EmptyState>
      )}
    </CoursesContainer>
  );
}

export default Courses;