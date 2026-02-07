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
`;

const AdminHeader = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 20px;
  padding: 3rem;
  color: white;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
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
`;

const AdminSubtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
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
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
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
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.colors.border} />
                <Tooltip
                  contentStyle={{
                    background: theme.colors.surface,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '10px'
                  }}
                />
                <Area type="monotone" dataKey="value" stroke={theme.colors.primary} fillOpacity={1} fill="url(#colorEnroll)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard>
          <ChartTitle>
            <FaChartPie /> Course Distribution
          </ChartTitle>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Web Dev', value: 400 },
                    { name: 'AI & ML', value: 300 },
                    { name: 'Design', value: 300 },
                    { name: 'Business', value: 200 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[theme.colors.primary, '#00C49F', '#FFBB28', '#FF8042'].map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </ChartsSection>

      <TabContainer>
        <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
          <FaUsers /> Users
        </TabButton>
        <TabButton active={activeTab === 'courses'} onClick={() => setActiveTab('courses')}>
          <FaBook /> Courses
        </TabButton>
      </TabContainer>

      {activeTab === 'users' ? (
        <>
          <TablesSection>
            <SectionTitle>
              <FaUsers /> User Management
            </SectionTitle>

            <SearchBar>
              <div style={{ flex: 1, position: 'relative' }}>
                <FaSearch style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                <input
                  style={{ width: '100%', padding: '1rem 1.5rem 1rem 3rem', borderRadius: '12px', border: `1px solid ${theme.colors.border}`, background: theme.colors.background, color: theme.colors.text }}
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </SearchBar>

            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Role</TableHeader>
                  <TableHeader>Joined</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <tbody>
                {filteredUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <span style={{ background: u.role === 'admin' ? theme.colors.primary : '#2ed573', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                        {u.role.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <ViewButton onClick={() => handleViewUser(u.id)}><FaEye /> View</ViewButton>
                        <DeleteButton
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          disabled={u.id === user.id}
                          style={{ opacity: u.id === user.id ? 0.5 : 1 }}
                        >
                          <FaTrash /> Remove
                        </DeleteButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TablesSection>

          <TablesSection>
            <SectionTitle><FaTable /> Recent Activity</SectionTitle>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>User</TableHeader>
                  <TableHeader>Action</TableHeader>
                  <TableHeader>Date</TableHeader>
                  <TableHeader>Performance</TableHeader>
                </TableRow>
              </TableHead>
              <tbody>
                {recentEnrollments.map((en) => (
                  <TableRow key={en.id}>
                    <TableCell>{en.userName}</TableCell>
                    <TableCell>Enrolled in {en.courseTitle}</TableCell>
                    <TableCell>{new Date(en.enrolledAt).toLocaleDateString()}</TableCell>
                    <TableCell><span style={{ color: '#2ed573', fontWeight: 700 }}>+${en.coursePrice}</span></TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TablesSection>
        </>
      ) : (
        <TablesSection>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <SectionTitle><FaBook /> Course Inventory</SectionTitle>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddCourse}
              style={{ background: theme.gradients.primary, color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem' }}
            >
              <FaPlus /> Create New Course
            </motion.button>
          </div>

          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Course Title</TableHeader>
                <TableHeader>Instructor</TableHeader>
                <TableHeader>Price</TableHeader>
                <TableHeader>Students</TableHeader>
                <TableHeader>Rating</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <tbody>
              {courses.map((c) => (
                <TableRow key={c.id}>
                  <TableCell style={{ fontWeight: 700 }}>{c.title}</TableCell>
                  <TableCell>{c.instructor}</TableCell>
                  <TableCell>${c.price}</TableCell>
                  <TableCell><FaUsers style={{ marginRight: '5px', opacity: 0.5 }} /> {c.students}</TableCell>
                  <TableCell style={{ color: '#ffa502', fontWeight: 700 }}>★ {c.rating}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <ViewButton onClick={() => handleEditCourse(c)}><FaEdit /> Edit</ViewButton>
                      <DeleteButton onClick={() => setConfirmModal({ show: true, userId: c.id, userName: c.title, type: 'course' })}><FaTrash /> Delete</DeleteButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TablesSection>
      )}

      {/* Course Editor Modal */}
      {showCourseModal && (
        <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowCourseModal(false)}>
          <ModalContent
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <ModalHeader>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <FaBook /> {currentCourse ? 'Edit Course' : 'Create New Course'}
              </h3>
              <button onClick={() => setShowCourseModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}><FaTimes /></button>
            </ModalHeader>

            <FormGrid>
              <FormGroup>
                <label>Course Title</label>
                <input value={courseFormData.title} onChange={e => setCourseFormData({ ...courseFormData, title: e.target.value })} placeholder="e.g. Master React in 30 Days" />
              </FormGroup>
              <FormGroup>
                <label>Instructor</label>
                <input value={courseFormData.instructor} onChange={e => setCourseFormData({ ...courseFormData, instructor: e.target.value })} />
              </FormGroup>
              <FormGroup>
                <label>Category</label>
                <input value={courseFormData.category} onChange={e => setCourseFormData({ ...courseFormData, category: e.target.value })} placeholder="Web Development" />
              </FormGroup>
              <FormGroup>
                <label>Price ($)</label>
                <input type="number" value={courseFormData.price} onChange={e => setCourseFormData({ ...courseFormData, price: e.target.value })} />
              </FormGroup>
              <FormGroup>
                <label>Level</label>
                <select value={courseFormData.level} onChange={e => setCourseFormData({ ...courseFormData, level: e.target.value })}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </FormGroup>
              <FormGroup>
                <label>Duration</label>
                <input value={courseFormData.duration} onChange={e => setCourseFormData({ ...courseFormData, duration: e.target.value })} placeholder="40 hours" />
              </FormGroup>
              <FormGroup style={{ gridColumn: 'span 2' }}>
                <label>Description</label>
                <textarea rows="4" value={courseFormData.description} onChange={e => setCourseFormData({ ...courseFormData, description: e.target.value })} />
              </FormGroup>
              <FormGroup style={{ gridColumn: 'span 2' }}>
                <label>Image URL</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input style={{ flex: 1 }} value={courseFormData.image} onChange={e => setCourseFormData({ ...courseFormData, image: e.target.value })} />
                  <img src={courseFormData.image} style={{ width: '80px', height: '50px', borderRadius: '5px', objectFit: 'cover' }} alt="Preview" />
                </div>
              </FormGroup>
            </FormGrid>

            <ModuleList>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h4 style={{ margin: 0 }}><FaLayerGroup /> Curriculum Builder</h4>
                <button onClick={addModule} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: '#667eea', color: 'white', fontWeight: 'bold' }}>+ Add Module</button>
              </div>

              {courseFormData.modules.map((mod, mIdx) => (
                <div key={mod.id} style={{ background: 'rgba(102, 126, 234, 0.05)', padding: '1.5rem', borderRadius: '15px', marginBottom: '1.5rem', border: '1px solid rgba(102, 126, 234, 0.1)' }}>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <input
                      style={{ flex: 1, fontWeight: 'bold' }}
                      value={mod.title}
                      onChange={e => {
                        const newMods = [...courseFormData.modules];
                        newMods[mIdx].title = e.target.value;
                        setCourseFormData({ ...courseFormData, modules: newMods });
                      }}
                    />
                    <button onClick={() => addLesson(mod.id)} style={{ padding: '0.5rem', background: '#2ed573', color: 'white', border: 'none', borderRadius: '5px' }}>+ Lesson</button>
                  </div>

                  {mod.lessons.map((lesson, lIdx) => (
                    <LessonRow key={lesson.id}>
                      <span style={{ color: '#667eea', fontWeight: 'bold' }}>{lIdx + 1}</span>
                      <input
                        style={{ flex: 2 }}
                        placeholder="Lesson Title"
                        value={lesson.title}
                        onChange={e => {
                          const newMods = [...courseFormData.modules];
                          newMods[mIdx].lessons[lIdx].title = e.target.value;
                          setCourseFormData({ ...courseFormData, modules: newMods });
                        }}
                      />
                      <select
                        value={lesson.type}
                        onChange={e => {
                          const newMods = [...courseFormData.modules];
                          newMods[mIdx].lessons[lIdx].type = e.target.value;
                          setCourseFormData({ ...courseFormData, modules: newMods });
                        }}
                      >
                        <option value="video">Video</option>
                        <option value="reading">Reading</option>
                        <option value="quiz">Quiz</option>
                      </select>
                      <input
                        style={{ flex: 1 }}
                        placeholder="Time"
                        value={lesson.duration}
                        onChange={e => {
                          const newMods = [...courseFormData.modules];
                          newMods[mIdx].lessons[lIdx].duration = e.target.value;
                          setCourseFormData({ ...courseFormData, modules: newMods });
                        }}
                      />
                      <button
                        style={{ background: '#ff4757', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '5px' }}
                        onClick={() => {
                          const newMods = [...courseFormData.modules];
                          newMods[mIdx].lessons.splice(lIdx, 1);
                          setCourseFormData({ ...courseFormData, modules: newMods });
                        }}
                      >
                        <FaTrashAlt />
                      </button>
                    </LessonRow>
                  ))}
                </div>
              ))}
            </ModuleList>

            <div style={{ padding: '2rem', borderTop: `1px solid ${theme.colors.border}`, textAlign: 'right', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <SecondaryButton onClick={() => setShowCourseModal(false)}>Cancel</SecondaryButton>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveCourse}
                style={{ padding: '1rem 3rem', background: theme.gradients.primary, color: 'white', border: 'none', borderRadius: '15px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem' }}
              >
                <FaSave /> {currentCourse ? 'Update Course' : 'Launch Course'}
              </motion.button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowUserModal(false)}>
          <ModalContent initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <h3 style={{ margin: 0 }}>User Details</h3>
              <button onClick={() => setShowUserModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}>&times;</button>
            </ModalHeader>
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: theme.gradients.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h2 style={{ margin: 0, color: theme.colors.text }}>{selectedUser.name}</h2>
                  <p style={{ margin: '0.5rem 0', color: theme.colors.textSecondary }}>{selectedUser.email}</p>
                  <span style={{ background: selectedUser.role === 'admin' ? theme.colors.primary : '#2ed573', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                    {selectedUser.role.toUpperCase()}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', background: theme.colors.background, padding: '1.5rem', borderRadius: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: theme.colors.textSecondary, marginBottom: '0.3rem' }}>User ID</label>
                  <div style={{ fontWeight: '600' }}>{selectedUser.id}</div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: theme.colors.textSecondary, marginBottom: '0.3rem' }}>Joined Date</label>
                  <div style={{ fontWeight: '600' }}>{new Date(selectedUser.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                <ViewButton onClick={() => setShowUserModal(false)} style={{ display: 'inline-flex' }}>Close</ViewButton>
              </div>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setConfirmModal({ show: false, userId: null, userName: '' })}>
          <ModalContent
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '400px' }}
          >
            <div style={{ padding: '3rem 2.5rem', textAlign: 'center' }}>
              <motion.div
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                style={{ fontSize: '5rem', color: '#ef4444', marginBottom: '1.5rem', filter: 'drop-shadow(0 10px 20px rgba(239, 68, 68, 0.3))' }}
              >
                <FaExclamationTriangle />
              </motion.div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', color: theme.colors.text }}>Are you sure?</h2>
              <p style={{ color: theme.colors.textSecondary, fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                You are about to remove <strong style={{ color: theme.colors.primary }}>{confirmModal.userName}</strong>. This will permanently delete their account and all associated enrollments.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                <SecondaryButton
                  onClick={() => setConfirmModal({ show: false, userId: null, userName: '' })}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Keep User
                </SecondaryButton>
                <motion.button
                  onClick={confirmDelete}
                  whileHover={{ scale: 1.05, background: '#dc2626' }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '15px',
                    fontWeight: '800',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 10px 25px rgba(239, 68, 68, 0.4)',
                    padding: '1.2rem'
                  }}
                >
                  Delete Profile
                </motion.button>
              </div>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Notification Toast */}
      {notification && (
        <Toast
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          type={notification.type}
        >
          <div className="icon">
            {notification.type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
          </div>
          <div className="content">
            {notification.message}
          </div>
          <button className="close" onClick={() => setNotification(null)}>&times;</button>
        </Toast>
      )}
    </AdminContainer>
  );
}

export default AdminDashboard;
