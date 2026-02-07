import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaUser, FaSignOutAlt, FaBars, FaTimes, FaGraduationCap } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Nav = styled(motion.nav)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
`;

const NavContainer = styled.div`
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
  color: #667eea;
  font-size: 1.8rem;
  font-weight: 800;
  
  span {
    background: linear-gradient(45deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const LogoIcon = styled(FaGraduationCap)`
  margin-right: 10px;
  font-size: 2rem;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.98);
    flex-direction: column;
    padding: 2rem;
    gap: 1.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border-radius: 0 0 20px 20px;
    backdrop-filter: blur(10px);
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: 500;
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: linear-gradient(45deg, #667eea, #764ba2);
    transition: width 0.3s ease;
  }

  &:hover::before {
    width: 80%;
  }

  &:hover {
    color: #667eea;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Button = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LoginButton = styled(Button)`
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;

  &:hover {
    background: #667eea;
    color: white;
  }
`;

const RegisterButton = styled(Button)`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.6);
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 50px;
  color: #667eea;
  font-weight: 500;
`;

const LogoutButton = styled(Button)`
  background: #ff4757;
  color: white;
  padding: 0.6rem 1.2rem;

  &:hover {
    background: #ff3742;
    transform: translateY(-2px);
  }
`;

const MobileMenuButton = styled(Button)`
  display: none;
  background: transparent;
  color: #667eea;
  font-size: 1.5rem;
  padding: 0.5rem;

  @media (max-width: 768px) {
    display: flex;
  }
`;

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <Nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <NavContainer>
        <Logo to="/" onClick={() => setIsMenuOpen(false)}>
          <LogoIcon />
          <span>CourseFlow</span>
        </Logo>

        <MobileMenuButton
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileTap={{ scale: 0.9 }}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>

        <NavLinks isOpen={isMenuOpen}>
          <NavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
          <NavLink to="/courses" onClick={() => setIsMenuOpen(false)}>Courses</NavLink>
          
          {user && (
            <NavLink to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</NavLink>
          )}
          
          {user?.role === 'admin' && (
            <NavLink to="/admin" onClick={() => setIsMenuOpen(false)}>Admin</NavLink>
          )}

          {!user ? (
            <AuthButtons>
              <LoginButton
                as={Link}
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUser /> Login
              </LoginButton>
              <RegisterButton
                as={Link}
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </RegisterButton>
            </AuthButtons>
          ) : (
            <UserMenu>
              <UserInfo>
                <FaUser />
                <span>{user.name}</span>
                {user.role === 'admin' && (
                  <span style={{
                    background: '#667eea',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '0.8rem'
                  }}>Admin</span>
                )}
              </UserInfo>
              <LogoutButton
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSignOutAlt /> Logout
              </LogoutButton>
            </UserMenu>
          )}
        </NavLinks>
      </NavContainer>
    </Nav>
  );
}

export default Navbar;