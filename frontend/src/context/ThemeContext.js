import React, { createContext, useState, useEffect, useContext } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark';
    });

    const toggleTheme = () => {
        setIsDarkMode(prev => {
            const newTheme = !prev;
            localStorage.setItem('theme', newTheme ? 'dark' : 'light');
            return newTheme;
        });
    };

    const theme = {
        isDarkMode,
        colors: isDarkMode ? {
            background: '#0f172a',
            surface: '#1e293b',
            text: '#f8fafc',
            textSecondary: '#94a3b8',
            primary: '#6366f1',
            secondary: '#667eea',
            border: 'rgba(255, 255, 255, 0.1)',
            glass: 'rgba(30, 41, 59, 0.7)',
            glassBorder: 'rgba(255, 255, 255, 0.1)',
        } : {
            background: '#f8fafc',
            surface: '#ffffff',
            text: '#0f172a',
            textSecondary: '#64748b',
            primary: '#6366f1',
            secondary: '#667eea',
            border: 'rgba(0, 0, 0, 0.1)',
            glass: 'rgba(255, 255, 255, 0.7)',
            glassBorder: 'rgba(255, 255, 255, 0.3)',
        },
        gradients: {
            primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            secondary: 'linear-gradient(45deg, #ff7e5f 0%, #feb47b 100%)',
            success: 'linear-gradient(45deg, #10b981 0%, #3b82f6 100%)',
        },
        shadows: {
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
            <StyledThemeProvider theme={theme}>
                {children}
            </StyledThemeProvider>
        </ThemeContext.Provider>
    );
};
