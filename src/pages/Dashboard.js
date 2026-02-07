import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';
import config from '../config';
import {
  FaBook,
  FaChartLine,
  FaClock,
  FaCheckCircle,
  FaPlayCircle,
  FaCertificate,
  FaTrophy,
  FaChartBar,
  FaStar,
  FaGraduationCap
} from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const DashboardContainer = styled(motion.div)`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 3rem;
  color: white;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
    background-size: 30px 30px;
    animation: float 20s linear infinite;
  }

  @keyframes float {
    0% { transform: translate(0, 0) rotate(0deg); }
    100% { transform: translate(-50px, -50px) rotate(360deg); }
  }
`;

const WelcomeContent = styled.div`
  position: relative;
  z-index: 1;
`;

const WelcomeTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 0.5rem;
`;

const WelcomeText = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 15px;
  background: ${props => props.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
`;

const Badge = styled.div`
  background: ${props => {
    switch (props.level) {
      case 'Beginner': return 'rgba(46, 213, 115, 0.1)';
      case 'Intermediate': return 'rgba(255, 165, 0, 0.1)';
      case 'Advanced': return 'rgba(255, 71, 87, 0.1)';
      default: return 'rgba(102, 126, 234, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.level) {
      case 'Beginner': return '#2ed573';
      case 'Intermediate': return '#ffa502';
      case 'Advanced': return '#ff4757';
      default: return '#667eea';
    }
  }};
  padding: 0.3rem 1rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
`;

const Section = styled.div`
  background: ${props => props.theme.colors.surface};
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.border};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1.5rem;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.8rem;

  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const ViewAllButton = styled(Link)`
  padding: 0.8rem 1.5rem;
  background: transparent;
  border: 2px solid #667eea;
  color: #667eea;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
  }
`;

const CoursesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: 1.5rem;
`;

const CourseCard = styled(motion.div)`
  background: rgba(102, 126, 234, 0.05);
  border-radius: 15px;
  padding: 1.5rem;
  border: 2px solid rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: #667eea;
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.2);
  }
`;

const CourseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
`;

const CourseTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
  flex: 1;
`;

const ProgressBar = styled.div`
  height: 8px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 4px;
  margin: 1rem 0;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 4px;
  width: ${props => props.progress || 0}%;
  transition: width 0.5s ease;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const CourseAction = styled(Link)`
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background: #667eea;
  color: white;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background: #764ba2;
    transform: translateY(-2px);
  }
`;

const RecentActivity = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActivityItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 10px;
  border-left: 4px solid #667eea;
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-weight: 600;
  color: #333;
`;

const ActivityTime = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.3rem;
`;

const AchievementBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(255, 165, 0, 0.1), rgba(255, 69, 0, 0.1));
  border-radius: 10px;
  border: 2px solid rgba(255, 165, 0, 0.3);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;

  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #667eea;
    opacity: 0.5;
  }

  h3 {
    margin-bottom: 0.5rem;
    color: #333;
  }
`;

function Dashboard() {
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    totalProgress: 0,
    studyHours: 0
  });

  const recentActivities = [
    {
      id: 1,
      icon: <FaPlayCircle />,
      title: 'Started "React Fundamentals" lesson',
      time: '2 hours ago'
    },
    {
      id: 2,
      icon: <FaCheckCircle />,
      title: 'Completed "JavaScript Basics" quiz',
      time: '1 day ago'
    },
    {
      id: 3,
      icon: <FaCertificate />,
      title: 'Earned "Web Developer" badge',
      time: '3 days ago'
    }
  ];

  const achievements = [
    {
      id: 1,
      icon: <FaTrophy />,
      title: 'Fast Learner',
      description: 'Complete 3 courses in one month'
    },
    {
      id: 2,
      icon: <FaStar />,
      title: 'Perfect Score',
      description: 'Score 100% on 5 quizzes'
    }
  ];

  useEffect(() => {
    if (user) {
      fetchEnrollments();
    }
  }, [user]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.API_BASE_URL}/api/courses/user/${user.id}/enrollments`);
      setEnrollments(response.data);

      // Calculate stats
      const enrolled = response.data.length;
      const completed = response.data.filter(e => e.completed).length;
      const totalProgress = response.data.reduce((sum, e) => sum + (e.progress || 0), 0) / enrolled || 0;

      setStats({
        enrolledCourses: enrolled,
        completedCourses: completed,
        totalProgress: Math.round(totalProgress),
        studyHours: enrolled * 10 // Estimated
      });
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      // Sample data for demo
      const sampleEnrollments = [
        {
          id: '1',
          courseId: '1',
          courseTitle: 'Full Stack Web Development',
          progress: 65,
          enrolledAt: '2024-01-15T10:30:00Z',
          lastAccessed: '2024-02-01T14:20:00Z',
          course: { level: 'Intermediate' }
        },
        {
          id: '2',
          courseId: '2',
          courseTitle: 'Data Science Masterclass',
          progress: 30,
          enrolledAt: '2024-01-20T09:15:00Z',
          lastAccessed: '2024-01-28T16:45:00Z',
          course: { level: 'Advanced' }
        }
      ];
      setEnrollments(sampleEnrollments);
      setStats({
        enrolledCourses: 2,
        completedCourses: 0,
        totalProgress: 48,
        studyHours: 20
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <DashboardContainer>
        <EmptyState>
          <FaGraduationCap />
          <h3>Please login to view your dashboard</h3>
          <p>Sign in to access your courses and progress</p>
        </EmptyState>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <WelcomeSection>
        <WelcomeContent>
          <WelcomeTitle>
            Welcome back, {user.name}!
          </WelcomeTitle>
          <WelcomeText>
            Continue your learning journey and track your progress.
          </WelcomeText>
        </WelcomeContent>
      </WelcomeSection>

      <StatsGrid>
        <StatCard
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <StatIcon color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <FaBook />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.enrolledCourses}</StatValue>
            <StatLabel>Enrolled Courses</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <StatIcon color="linear-gradient(135deg, #2ed573 0%, #1e90ff 100%)">
            <FaCheckCircle />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.completedCourses}</StatValue>
            <StatLabel>Completed Courses</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <StatIcon color="linear-gradient(135deg, #ffa502 0%, #ff6348 100%)">
            <FaChartLine />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.totalProgress}%</StatValue>
            <StatLabel>Overall Progress</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <StatIcon color="linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)">
            <FaClock />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.studyHours}</StatValue>
            <StatLabel>Study Hours</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionHeader>
          <SectionTitle>
            <FaChartLine /> Learning Activity
          </SectionTitle>
        </SectionHeader>
        <div style={{ height: '300px', width: '100%', padding: '1rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              { name: 'Mon', hours: 2 },
              { name: 'Tue', hours: 4 },
              { name: 'Wed', hours: 3 },
              { name: 'Thu', hours: 7 },
              { name: 'Fri', hours: 5 },
              { name: 'Sat', hours: 8 },
              { name: 'Sun', hours: 6 },
            ]}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.colors.primary} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={theme.colors.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke={theme.colors.textSecondary} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke={theme.colors.textSecondary} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.colors.surface,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '10px',
                  color: theme.colors.text
                }}
              />
              <Area type="monotone" dataKey="hours" stroke={theme.colors.primary} fillOpacity={1} fill="url(#colorHours)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>
            <FaBook /> My Courses
          </SectionTitle>
          <ViewAllButton to="/courses">
            Browse More Courses
          </ViewAllButton>
        </SectionHeader>

        {enrollments.length > 0 ? (
          <CoursesGrid>
            {enrollments.map((enrollment, index) => (
              <CourseCard
                key={enrollment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <CourseHeader>
                  <div>
                    <CourseTitle>{enrollment.courseTitle}</CourseTitle>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                      Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge level={enrollment.course?.level || 'Intermediate'}>
                    {enrollment.course?.level || 'Intermediate'}
                  </Badge>
                </CourseHeader>

                <ProgressBar>
                  <ProgressFill progress={enrollment.progress || 0} />
                </ProgressBar>

                <ProgressText>
                  <span>Progress</span>
                  <span>{enrollment.progress || 0}%</span>
                </ProgressText>

                <CourseAction to={`/courses/${enrollment.courseId}/learn`}>
                  {enrollment.progress === 100 ? (
                    <>
                      <FaCertificate /> View Certificate
                    </>
                  ) : (
                    <>
                      <FaPlayCircle /> Continue Learning
                    </>
                  )}
                </CourseAction>
              </CourseCard>
            ))}
          </CoursesGrid>
        ) : (
          <EmptyState>
            <FaBook />
            <h3>No courses enrolled yet</h3>
            <p>Start your learning journey by enrolling in a course</p>
            <ViewAllButton to="/courses" style={{ marginTop: '1rem' }}>
              Browse Courses
            </ViewAllButton>
          </EmptyState>
        )}
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>
            <FaChartBar /> Recent Activity
          </SectionTitle>
        </SectionHeader>

        <RecentActivity>
          {recentActivities.map((activity, index) => (
            <ActivityItem
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ActivityIcon>
                {activity.icon}
              </ActivityIcon>
              <ActivityContent>
                <ActivityTitle>{activity.title}</ActivityTitle>
                <ActivityTime>{activity.time}</ActivityTime>
              </ActivityContent>
            </ActivityItem>
          ))}
        </RecentActivity>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>
            <FaTrophy /> Achievements
          </SectionTitle>
        </SectionHeader>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {achievements.map((achievement) => (
            <AchievementBadge key={achievement.id}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #ffa502, #ff6348)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem'
              }}>
                {achievement.icon}
              </div>
              <div>
                <div style={{ fontWeight: '600', color: '#333' }}>
                  {achievement.title}
                </div>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>
                  {achievement.description}
                </div>
              </div>
            </AchievementBadge>
          ))}
        </div>
      </Section>
    </DashboardContainer>
  );
}

export default Dashboard;