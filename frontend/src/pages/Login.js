import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const LoginContainer = styled(motion.div)`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const LoginCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  backdrop-filter: blur(15px);
  border-radius: 30px;
  padding: 3.5rem;
  width: 100%;
  max-width: 480px;
  box-shadow: ${props => props.theme.shadows.xl};
  border: 1px solid ${props => props.theme.colors.border};
`;

const Title = styled.h2`
  text-align: center;
  color: ${props => props.theme.colors.text};
  font-size: clamp(2rem, 5vw, 2.8rem);
  font-weight: 900;
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
  padding: 1.2rem 1rem 1.2rem 3.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}22;
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

const SubmitButton = styled(motion.button)`
  padding: 1.2rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1.5rem;
  box-shadow: 0 10px 20px ${props => props.theme.colors.primary}44;

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

const DemoCredentials = styled.div`
  background: rgba(102, 126, 234, 0.1);
  padding: 1rem;
  border-radius: 10px;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #667eea;

  strong {
    display: block;
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0.3rem 0;
    font-size: 0.85rem;
  }
`;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      setError(result.message || 'Login failed');
    }

    setIsLoading(false);
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);

    setError('');
    setSuccess('');
    setIsLoading(true);

    const result = await login(demoEmail, demoPassword);

    if (result.success) {
      setSuccess('Demo login successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      setError(result.message || 'Demo login failed');
    }

    setIsLoading(false);
  };

  return (
    <LoginContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <LoginCard
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Title>Welcome Back</Title>
        <Subtitle>Sign in to continue your learning journey</Subtitle>

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
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <FaLock />
            </InputIcon>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </PasswordToggle>
          </InputGroup>

          <SubmitButton
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </SubmitButton>
        </Form>

        <DemoCredentials>
          <strong>Demo Credentials:</strong>
          <p>
            <strong>Admin:</strong> admin@example.com / admin123
            <button
              onClick={() => handleDemoLogin('admin@example.com', 'admin123')}
              style={{
                marginLeft: '10px',
                background: 'transparent',
                border: '1px solid #667eea',
                color: '#667eea',
                padding: '2px 8px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Use
            </button>
          </p>
          <p>
            <strong>Student:</strong> student@example.com / student123
            <button
              onClick={() => handleDemoLogin('student@example.com', 'student123')}
              style={{
                marginLeft: '10px',
                background: 'transparent',
                border: '1px solid #667eea',
                color: '#667eea',
                padding: '2px 8px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Use
            </button>
          </p>
        </DemoCredentials>

        <LinkText>
          Don't have an account? <Link to="/register">Sign up here</Link>
        </LinkText>
      </LoginCard>
    </LoginContainer>
  );
}

export default Login;