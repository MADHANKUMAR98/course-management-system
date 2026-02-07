import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --secondary-gradient: linear-gradient(45deg, #ff7e5f 0%, #feb47b 100%);
    --success-gradient: linear-gradient(45deg, #2ed573 0%, #1e90ff 100%);
    --glass-bg: rgba(255, 255, 255, 0.15);
    --glass-border: rgba(255, 255, 255, 0.18);
    --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 60px rgba(0, 0, 0, 0.15);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: ${props => props.theme.colors.background};
    min-height: 100vh;
    color: ${props => props.theme.colors.text};
    overflow-x: hidden;
    transition: background 0.3s ease, color 0.3s ease;
    -webkit-tap-highlight-color: transparent;
    font-size: 16px;

    @media (max-width: 768px) {
      font-size: 14px;
    }
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 10px;
    transition: all 0.3s ease;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  }

  /* Selection style */
  ::selection {
    background: rgba(102, 126, 234, 0.3);
    color: white;
  }

  /* Smooth focus outline */
  *:focus {
    outline: 2px solid rgba(102, 126, 234, 0.5);
    outline-offset: 2px;
  }

  /* Smooth transitions */
  a, button, input, textarea {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Loading animation */
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }

  .shimmer {
    background: linear-gradient(90deg, 
      rgba(255,255,255,0) 0%, 
      rgba(255,255,255,0.8) 50%, 
      rgba(255,255,255,0) 100%);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }

  /* Pulse animation */
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  /* Floating animation */
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }

  .floating {
    animation: float 6s ease-in-out infinite;
  }

  /* Gradient text */
  .gradient-text {
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Glass effect */
  .glass {
    background: ${props => props.theme.colors.glass};
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid ${props => props.theme.colors.glassBorder};
    box-shadow: var(--shadow-lg);
  }

  /* 3D Card hover effect */
  .card-3d {
    transform-style: preserve-3d;
    transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    
    &:hover {
      transform: translateY(-10px) rotateX(5deg) rotateY(5deg);
    }
  }
`;