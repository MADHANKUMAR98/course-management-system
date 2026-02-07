import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import {
  FaUser,
  FaSignOutAlt,
  FaGraduationCap,
  FaChevronDown,
  FaBell,
  FaEnvelope,
  FaSearch,
  FaCog,
  FaMoon,
  FaSun,
  FaBars,
  FaTimes,
  FaHome,
  FaBook,
  FaTrophy,
  FaChartLine
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const NavContainer = styled(motion.nav)`
  background: ${props => props.theme.colors.glass};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 1rem 2rem;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    padding: 0.8rem 1rem;
  }
`;

const NavWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(45deg, #667eea, #764ba2, #ff7e5f);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 3s ease infinite;
  z-index: 1001;

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }

  @keyframes gradient {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`;

const LogoIcon = styled.div`
  margin-right: 10px;
  font-size: 2.2rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const NavSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  padding: 0.6rem 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: ${props => props.theme.colors.primary};
  }
`;

const MobileMenuBtn = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;

  @media (max-width: 1024px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  background: ${props => props.theme.colors.background};
  z-index: 1000;
  padding: 6rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
`;

const UserDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  width: 280px;
  background: ${props => props.theme.colors.surface};
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1rem;
  box-shadow: ${props => props.theme.shadows.xl};
  border: 1px solid ${props => props.theme.colors.border};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const DropdownItem = styled(Link)`
  padding: 0.8rem 1rem;
  border-radius: 12px;
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover {
    background: ${props => props.theme.colors.primary}11;
    color: ${props => props.theme.colors.primary};
  }
`;

const DropdownButton = styled.button`
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  border: none;
  background: none;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-family: inherit;

  &:hover {
    background: #ef444411;
    color: #ef4444;
  }
`;

const MobileNavButton = styled.button`
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  font-size: 1.2rem;
  font-weight: 700;
  padding: 1rem;
  border-radius: 15px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}11;
  }

  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const MobileNavLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  font-size: 1.2rem;
  font-weight: 700;
  padding: 1rem;
  border-radius: 15px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}11;
  }

  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const ThemeToggle = styled(motion.button)`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  border: 2px solid rgba(102, 126, 234, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    margin-left: auto;
    margin-right: 1rem;
  }
`;

const UserAvatar = styled(motion.div)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  cursor: pointer;
`;

const MobileSearch = styled.div`
  margin-bottom: 1rem;
  position: relative;

  input {
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 15px;
    background: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.text};
  }

  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${props => props.theme.colors.primary};
  }
`;

function NavbarEnhanced() {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    setIsOpen(false);
    setShowUserMenu(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <NavContainer>
      <NavWrapper>
        <Logo to="/">
          <LogoIcon><FaGraduationCap /></LogoIcon>
          <span>EduMaster</span>
        </Logo>

        {/* Desktop Navigation */}
        <NavSection>
          <NavLink to="/"><FaHome /> Home</NavLink>
          <NavLink to="/courses"><FaBook /> Courses</NavLink>
          <NavLink to="/dashboard"><FaChartLine /> Dashboard</NavLink>
          <NavLink to="/leaderboard"><FaTrophy /> Leaderboard</NavLink>

          {user?.role === 'admin' && (
            <NavLink to="/admin">Admin</NavLink>
          )}

          <ThemeToggle onClick={toggleTheme}>
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </ThemeToggle>

          {user ? (
            <div style={{ position: 'relative' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <UserAvatar
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </UserAvatar>
                <FaChevronDown style={{ fontSize: '0.8rem', color: theme.colors.textSecondary, transform: showUserMenu ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
              </div>

              <AnimatePresence>
                {showUserMenu && (
                  <UserDropdown
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <div style={{ padding: '0.5rem 1rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: theme.colors.text }}>{user.name}</div>
                      <div style={{ fontSize: '0.85rem', color: theme.colors.textSecondary }}>{user.email}</div>
                    </div>
                    <hr style={{ border: 'none', borderTop: `1px solid ${theme.colors.border}`, margin: '0.5rem 0' }} />
                    <DropdownItem to="/profile"><FaUser /> My Profile</DropdownItem>
                    <DropdownItem to="/dashboard"><FaChartLine /> Dashboard</DropdownItem>
                    <DropdownItem to="/settings"><FaCog /> Settings</DropdownItem>
                    <hr style={{ border: 'none', borderTop: `1px solid ${theme.colors.border}`, margin: '0.5rem 0' }} />
                    <DropdownButton onClick={handleLogout}>
                      <FaSignOutAlt /> Logout
                    </DropdownButton>
                  </UserDropdown>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <NavLink to="/login" style={{ background: 'linear-gradient(45deg, #667eea, #764ba2)', color: 'white' }}>
              Login
            </NavLink>
          )}
        </NavSection>

        {/* Mobile Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ThemeToggle onClick={toggleTheme} style={{ display: window.innerWidth <= 1024 ? 'flex' : 'none' }}>
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </ThemeToggle>
            <MobileMenuBtn onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <FaTimes /> : <FaBars />}
            </MobileMenuBtn>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <MobileMenu
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <MobileSearch>
                <input type="text" placeholder="Search courses..." />
                <FaSearch />
              </MobileSearch>

              <MobileNavLink to="/"><FaHome /> Home</MobileNavLink>
              <MobileNavLink to="/courses"><FaBook /> Courses</MobileNavLink>
              <MobileNavLink to="/dashboard"><FaChartLine /> Dashboard</MobileNavLink>
              <MobileNavLink to="/leaderboard"><FaTrophy /> Leaderboard</MobileNavLink>

              {user?.role === 'admin' && (
                <MobileNavLink to="/admin"><FaCog /> Admin Panel</MobileNavLink>
              )}

              {user ? (
                <>
                  <MobileNavLink to="/profile"><FaUser /> My Profile</MobileNavLink>
                  <MobileNavButton onClick={handleLogout} style={{ marginTop: 'auto', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                    <FaSignOutAlt /> Logout
                  </MobileNavButton>
                </>
              ) : (
                <MobileNavLink to="/login" style={{ background: 'linear-gradient(45deg, #667eea, #764ba2)', color: 'white', border: 'none' }}>
                  <FaUser /> Login / Sign Up
                </MobileNavLink>
              )}
            </MobileMenu>
          )}
        </AnimatePresence>
      </NavWrapper>
    </NavContainer>
  );
}

export default NavbarEnhanced;