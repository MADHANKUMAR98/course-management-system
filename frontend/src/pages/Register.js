import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserGraduate } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const RegisterContainer = styled(motion.div)`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const RegisterCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: ${props => props.theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #667eea;
  font-size: 1.2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.5rem;
`;

const RoleSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
`;

const RoleButton = styled(motion.button)`
  flex: 1;
  padding: 1rem;
  border: 2px solid ${props => props.selected ? '#667eea' : 'rgba(102, 126, 234, 0.2)'};
  background: ${props => props.selected ? 'rgba(102, 126, 234, 0.1)' : 'transparent'};
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.selected ? '#667eea' : '#666'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    color: #667eea;
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 1rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
  }
`;

const ErrorMessage = styled.div`
  background: #ff4757;
  color: white;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
  animation: shake 0.5s ease-in-out;

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`;

const SuccessMessage = styled.div`
  background: #2ed573;
  color: white;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
`;

const LinkText = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: #666;

  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.role
    );

    if (result.success) {
      setSuccess('Registration successful! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      setError(result.message || 'Registration failed');
    }

    setIsLoading(false);
  };

  return (
    <RegisterContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <RegisterCard
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Title>Join EduMaster</Title>
        <Subtitle>Start your learning journey today</Subtitle>

        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}

        {success && (
          <SuccessMessage>
            {success}
          </SuccessMessage>
        )}

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <InputIcon>
              <FaUser />
            </InputIcon>
            <Input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <FaEnvelope />
            </InputIcon>
            <Input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <FaLock />
            </InputIcon>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password (min. 6 characters)"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </PasswordToggle>
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <FaLock />
            </InputIcon>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </PasswordToggle>
          </InputGroup>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
              Select Role:
            </label>
            <RoleSelector>
              <RoleButton
                type="button"
                selected={formData.role === 'student'}
                onClick={() => setFormData({ ...formData, role: 'student' })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaUserGraduate /> Student
              </RoleButton>
              <RoleButton
                type="button"
                selected={formData.role === 'admin'}
                onClick={() => setFormData({ ...formData, role: 'admin' })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaUser /> Admin
              </RoleButton>
            </RoleSelector>
          </div>

          <SubmitButton
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </SubmitButton>
        </Form>

        <LinkText>
          Already have an account? <Link to="/login">Sign in here</Link>
        </LinkText>
      </RegisterCard>
    </RegisterContainer>
  );
}

export default Register;