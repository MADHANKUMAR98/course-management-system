import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';
import config from '../config';
import {
  FaUsers,
  FaBook,
  FaChartLine,
  FaDollarSign,
  FaCalendarAlt,
  FaUserCheck,
  FaChartBar,
  FaTable,
  FaEye,
  FaTrash,
  FaSearch,
  FaFilter,
  FaChartPie,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaQuestionCircle,
  FaPlus,
  FaEdit,
  FaSave,
  FaTimes,
  FaLayerGroup,
  FaTrashAlt,
  FaCloudUploadAlt
} from 'react-icons/fa';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const AdminContainer = styled(motion.div)`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const AdminHeader = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 20px;
  padding: 3rem;
  color: white;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    border-radius: 15px;
  }
`;

const AdminTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  svg {
    color: #667eea;
  }

  @media (max-width: 768px) {
    font-size: 1.8rem;
    gap: 0.5rem;
  }
`;

const AdminSubtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
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
  color: #666;
  font-size: 1rem;
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ChartCard = styled.div`
  background: ${props => props.theme.colors.surface};
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.border};
`;

const ChartTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.8rem;

  svg {
    color: #667eea;
  }
`;

const TablesSection = styled.div`
  background: ${props => props.theme.colors.surface};
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.border};
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 12px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.8rem;

  svg {
    color: #667eea;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 2rem;
  color: #667eea;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding-bottom: 1rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    &::-webkit-scrollbar { display: none; }
  }
`;

const TabButton = styled.button`
  padding: 1rem 2rem;
  border: none;
  background: ${props => props.active ? props.theme.gradients.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.textSecondary};
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.8rem;

  &:hover {
    background: ${props => props.active ? props.theme.gradients.primary : props.theme.colors.border};
  }

  @media (max-width: 768px) {
    padding: 0.8rem 1.2rem;
    font-size: 0.9rem;
    white-space: nowrap;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  padding: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.85rem;
    font-weight: 600;
    color: ${props => props.theme.colors.textSecondary};
  }

  input, select, textarea {
    padding: 0.8rem 1rem;
    border-radius: 10px;
    border: 1px solid ${props => props.theme.colors.border};
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    &:focus { outline: none; border-color: ${props => props.theme.colors.primary}; }
  }
`;

const ModuleList = styled.div`
  padding: 1.5rem;
  background: ${props => props.theme.colors.background};
  border-radius: 15px;
  margin: 1.5rem;
`;

const LessonRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: white;
  border-radius: 8px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: ${props => props.theme.colors.background};
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: rgba(102, 126, 234, 0.05);
  }

  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
`;

const TableHeader = styled.th`
  padding: 1.2rem 1rem;
  text-align: left;
  color: ${props => props.theme.colors.primary};
  font-weight: 700;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  white-space: nowrap;
`;

const TableCell = styled.td`
  padding: 1.2rem 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
`;

const ViewButton = styled(ActionButton)`
  background: rgba(46, 213, 115, 0.1);
  color: #2ed573;

  &:hover {
    background: #2ed573;
    color: white;
  }
`;

const DeleteButton = styled(ActionButton)`
  background: rgba(255, 71, 87, 0.1);
  color: #ff4757;

  &:hover {
    background: #ff4757;
    color: white;
  }
`;

const NoAccessMessage = styled.div`
  text-align: center;
  padding: 4rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  h2 {
    color: #ff4757;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
    margin-bottom: 2rem;
  }
`;

const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: 25px;
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.theme.colors.border};
`;

const ModalHeader = styled.div`
  padding: 1.5rem 2rem;
  background: ${props => props.theme.colors.background};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SecondaryButton = styled(motion.button)`
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  font-weight: 800;
  cursor: pointer;
  padding: 1.2rem;
  border-radius: 15px;
  font-size: 1rem;
  transition: all 0.3s ease;
  &:hover { background: ${props => props.theme.colors.border}; }
`;

const Toast = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: ${props => props.type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)'};
  backdrop-filter: blur(10px);
  color: white;
  padding: 1.2rem 2.5rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  z-index: 3000;
  min-width: 320px;
  max-width: 500px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 6px;
    background: rgba(255, 255, 255, 0.4);
    width: 100%;
    animation: progress 4s linear forwards;
  }

  @keyframes progress {
    from { width: 100%; }
    to { width: 0%; }
  }

  .icon {
    font-size: 1.8rem;
    background: rgba(255, 255, 255, 0.2);
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
  }

  .content {
    font-weight: 700;
    font-size: 1.05rem;
    flex: 1;
  }

  .close {
    background: none;
    border: none;
    color: white;
    font-size: 1.8rem;
    cursor: pointer;
    opacity: 0.6;
    transition: all 0.2s;
    &:hover { opacity: 1; transform: scale(1.1); }
  }
`;

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0
  });
  const [users, setUsers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ show: false, userId: null, userName: '', type: 'user' });
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'courses'
  const [courses, setCourses] = useState([]);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [courseFormData, setCourseFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    price: '',
    category: '',
    level: 'Beginner',
    duration: '',
    image: '',
    modules: []
  });

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Fetch stats
      const statsResponse = await axios.get(`${config.API_BASE_URL}/api/admin/stats`);
      setStats(statsResponse.data);

      // Fetch users
      const usersResponse = await axios.get(`${config.API_BASE_URL}/api/admin/users`);
      setUsers(usersResponse.data);

      // Fetch enrollments
      const enrollmentsResponse = await axios.get(`${config.API_BASE_URL}/api/admin/enrollments`);
      setEnrollments(enrollmentsResponse.data);

      // Fetch courses for management
      const coursesResponse = await axios.get(`${config.API_BASE_URL}/api/admin/courses`);
      setCourses(coursesResponse.data);

    } catch (error) {
      console.error('Error fetching admin data:', error);
      showNotification('Failed to fetch real-time data. Showing sample data.', 'error');
      // Sample data for demo
      setStats({
        totalUsers: 150,
        totalCourses: 25,
        totalEnrollments: 450,
        totalRevenue: 22500.50
      });

      setUsers([
        { id: '1', name: 'John Doe', email: 'john@example.com', role: 'student', createdAt: '2024-01-15' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'student', createdAt: '2024-01-20' },
        { id: '3', name: 'Admin User', email: 'admin@example.com', role: 'admin', createdAt: '2024-01-01' }
      ]);

      setEnrollments([
        { id: '1', userName: 'John Doe', courseTitle: 'Web Development', enrolledAt: '2024-01-16', coursePrice: 49.99 },
        { id: '2', userName: 'Jane Smith', courseTitle: 'Data Science', enrolledAt: '2024-01-21', coursePrice: 59.99 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentEnrollments = enrollments.slice(0, 5);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDeleteUser = async (userId, userName) => {
    if (userId === user.id) {
      showNotification("You cannot delete your own administrator account!", "error");
      return;
    }
    setConfirmModal({ show: true, userId, userName });
  };

  const confirmDelete = async () => {
    const { userId, userName, type } = confirmModal;
    setConfirmModal({ show: false, userId: null, userName: '', type: 'user' });

    try {
      if (type === 'user') {
        await axios.delete(`${config.API_BASE_URL}/api/admin/users/${userId}`);
        showNotification(`User ${userName} removed successfully`, 'success');
      } else {
        await axios.delete(`${config.API_BASE_URL}/api/admin/courses/${userId}`);
        showNotification(`Course ${userName} deleted successfully`, 'success');
      }
      fetchAdminData();
    } catch (error) {
      console.error('Error deleting:', error);
      const errorMsg = error.response?.data?.message || 'Action failed';
      showNotification(`${errorMsg}. Please try again.`, 'error');
    }
  };

  const handleEditCourse = (course) => {
    setCurrentCourse(course);
    setCourseFormData({
      ...course,
      price: course.price.toString()
    });
    setShowCourseModal(true);
  };

  const handleAddCourse = () => {
    setCurrentCourse(null);
    setCourseFormData({
      title: '',
      description: '',
      instructor: user.name,
      price: '',
      category: '',
      level: 'Beginner',
      duration: '',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
      modules: []
    });
    setShowCourseModal(true);
  };

  const saveCourse = async () => {
    try {
      if (!courseFormData.title || !courseFormData.price) {
        showNotification('Please fill in at least Title and Price', 'error');
        return;
      }

      const price = parseFloat(courseFormData.price);
      if (isNaN(price)) {
        showNotification('Invalid price format', 'error');
        return;
      }

      const payload = {
        ...courseFormData,
        price
      };

      if (currentCourse) {
        await axios.put(`${config.API_BASE_URL}/api/admin/courses/${currentCourse.id}`, payload);
        showNotification('Course updated successfully');
      } else {
        await axios.post(`${config.API_BASE_URL}/api/admin/courses`, payload);
        showNotification('New course created!');
      }
      setShowCourseModal(false);
      fetchAdminData();
    } catch (error) {
      console.error('Error saving course:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error saving course';
      showNotification(errorMsg, 'error');
    }
  };

  const addModule = () => {
    setCourseFormData({
      ...courseFormData,
      modules: [
        ...courseFormData.modules,
        { id: Date.now().toString(), title: 'New Module', lessons: [] }
      ]
    });
  };

  const addLesson = (moduleId) => {
    const newModules = courseFormData.modules.map(mod => {
      if (mod.id === moduleId) {
        return {
          ...mod,
          lessons: [
            ...mod.lessons,
            { id: Date.now().toString(), title: 'New Lesson', type: 'video', duration: '10:00', content: '' }
          ]
        };
      }
      return mod;
    });
    setCourseFormData({ ...courseFormData, modules: newModules });
  };

  const handleViewUser = async (userId) => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/api/admin/users/${userId}`);
      setSelectedUser(response.data);
      setShowUserModal(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      showNotification('Failed to fetch user details', 'error');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <AdminContainer>
        <NoAccessMessage>
          <h2>Access Denied</h2>
          <p>You need administrator privileges to access this page.</p>
        </NoAccessMessage>
      </AdminContainer>
    );
  }

  if (loading) {
    return (
      <AdminContainer>
        <LoadingSpinner>
          <FaChartBar className="fa-spin" />
        </LoadingSpinner>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AdminHeader>
        <AdminTitle>
          <FaChartBar /> Admin Dashboard
        </AdminTitle>
        <AdminSubtitle>
          Manage your learning platform and monitor performance
        </AdminSubtitle>
      </AdminHeader>

      <StatsGrid>
        <StatCard
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <StatIcon color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <FaUsers />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.totalUsers}</StatValue>
            <StatLabel>Total Users</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <StatIcon color="linear-gradient(135deg, #2ed573 0%, #1e90ff 100%)">
            <FaBook />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.totalCourses}</StatValue>
            <StatLabel>Total Courses</StatLabel>
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
            <StatValue>{stats.totalEnrollments}</StatValue>
            <StatLabel>Enrollments</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <StatIcon color="linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)">
            <FaDollarSign />
          </StatIcon>
          <StatContent>
            <StatValue>${stats.totalRevenue.toLocaleString()}</StatValue>
            <StatLabel>Total Revenue</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <ChartsSection>
        <ChartCard>
          <ChartTitle>
            <FaChartLine /> Enrollment Trends
          </ChartTitle>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'Jan', value: 400 },
                { name: 'Feb', value: 300 },
                { name: 'Mar', value: 600 },
                { name: 'Apr', value: 800 },
                { name: 'May', value: 500 },
                { name: 'Jun', value: 900 },
              ]}>
                <defs>
                  <linearGradient id="colorEnroll" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.colors.primary} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={theme.colors.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke={theme.colors.textSecondary} />
                <YAxis stroke={theme.colors.textSecondary} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke={theme.colors.primary} fillOpacity={1} fill="url(#colorEnroll)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </ChartsSection>

      <SectionTitle>
        <FaLayerGroup /> Management
      </SectionTitle>

      <TabContainer>
        <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
          <FaUsers /> Users
        </TabButton>
        <TabButton active={activeTab === 'courses'} onClick={() => setActiveTab('courses')}>
          <FaBook /> Courses
        </TabButton>
      </TabContainer>

      {activeTab === 'users' ? (
        <TablesSection>
          <SearchBar>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', borderRadius: '10px', border: `1px solid ${theme.colors.border}`, background: theme.colors.background, color: theme.colors.text }}
              />
              <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: theme.colors.textSecondary }} />
            </div>
          </SearchBar>

          <Table>
            <TableHead>
              <tr>
                <TableHeader>User</TableHeader>
                <TableHeader>Role</TableHeader>
                <TableHeader>Joined</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </TableHead>
            <tbody>
              {filteredUsers.map(u => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div style={{ fontWeight: 600 }}>{u.name}</div>
                    <div style={{ fontSize: '0.85rem', color: theme.colors.textSecondary }}>{u.email}</div>
                  </TableCell>
                  <TableCell>
                    <span style={{ padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', background: u.role === 'admin' ? 'rgba(102, 126, 234, 0.1)' : 'rgba(0,0,0,0.05)', color: u.role === 'admin' ? theme.colors.primary : 'inherit' }}>
                      {u.role.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <ViewButton onClick={() => handleViewUser(u.id)}><FaEye /></ViewButton>
                      <DeleteButton onClick={() => handleDeleteUser(u.id, u.name)}><FaTrash /></DeleteButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TablesSection>
      ) : (
        <TablesSection>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaBook /> Course Management</h3>
            <button
              onClick={handleAddCourse}
              style={{ padding: '0.8rem 1.5rem', background: theme.gradients.primary, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <FaPlus /> Add Course
            </button>
          </div>
          <Table>
            <TableHead>
              <tr>
                <TableHeader>Course</TableHeader>
                <TableHeader>Category</TableHeader>
                <TableHeader>Price</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </TableHead>
            <tbody>
              {courses.map(c => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div style={{ fontWeight: 600 }}>{c.title}</div>
                    <div style={{ fontSize: '0.85rem', color: theme.colors.textSecondary }}>{c.instructor}</div>
                  </TableCell>
                  <TableCell>{c.category}</TableCell>
                  <TableCell>${c.price}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <ActionButton style={{ background: 'rgba(102, 126, 234, 0.1)', color: theme.colors.primary }} onClick={() => handleEditCourse(c)}>
                        <FaEdit />
                      </ActionButton>
                      <DeleteButton onClick={() => {
                        setConfirmModal({ show: true, userId: c.id, userName: c.title, type: 'course' });
                      }}>
                        <FaTrash />
                      </DeleteButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TablesSection>
      )}

      {/* Modals & Toasts would follow - but let's keep it clean for now */}
      {notification && (
        <Toast type={notification.type} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="icon">
            {notification.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
          </div>
          <div className="content">{notification.message}</div>
          <button className="close" onClick={() => setNotification(null)}><FaTimes /></button>
        </Toast>
      )}
    </AdminContainer>
  );
}

export default AdminDashboard;
