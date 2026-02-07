import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/NavbarEnhanced';
import Footer from './components/Footer';
import { GlobalStyles } from './styles/GlobalStyles';
import ScrollToTop from './components/ScrollToTop';
import ScrollProgress from './components/ScrollProgress';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import AdminDashboard from './pages/AdminDashboard';
import Payment from './pages/Payment';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import CoursePlayer from './pages/CoursePlayer';
import AnimatedBackground from './components/AnimatedBackground';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import CommandPalette from './components/CommandPalette';
import { useState, useEffect } from 'react';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <GlobalStyles />
          <ScrollToTop />
          <ScrollProgress />
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
      <AnimatedBackground />
      <Navbar />
      <main style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/leaderboard" element={<Leaderboard />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/payment/:id"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:id/learn"
              element={
                <ProtectedRoute>
                  <CoursePlayer />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;
