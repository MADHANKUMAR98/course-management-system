import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import { FaSearch, FaBook, FaPlay, FaCommand, FaTimes } from 'react-icons/fa';

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  justify-content: center;
  padding-top: 15vh;
`;

const Palette = styled(motion.div)`
  width: 100%;
  max-width: 650px;
  background: ${props => props.theme.colors.surface};
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 30px 60px rgba(0,0,0,0.5);
  overflow: hidden;
  height: fit-content;
  max-height: 500px;
  display: flex;
  flex-direction: column;
`;

const SearchInputRow = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem 2rem;
  gap: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  svg {
    font-size: 1.5rem;
    color: ${props => props.theme.colors.primary};
  }

  input {
    flex: 1;
    background: none;
    border: none;
    color: ${props => props.theme.colors.text};
    font-size: 1.2rem;
    &:focus { outline: none; }
  }

  kbd {
    background: ${props => props.theme.colors.background};
    padding: 0.3rem 0.6rem;
    border-radius: 6px;
    font-size: 0.8rem;
    border: 1px solid ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const ResultsList = styled.div`
  overflow-y: auto;
  padding: 1rem;
`;

const ResultItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  background: ${props => props.selected ? 'rgba(102, 126, 234, 0.1)' : 'transparent'};
  transition: all 0.2s;

  &:hover {
    background: rgba(102, 126, 234, 0.05);
  }

  .icon-box {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: ${props => props.isLesson ? 'rgba(46, 213, 115, 0.1)' : 'rgba(102, 126, 234, 0.1)'};
    color: ${props => props.isLesson ? '#2ed573' : '#667eea'};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .info {
    flex: 1;
    h4 { margin: 0; font-size: 1rem; }
    p { margin: 0.2rem 0 0; font-size: 0.85rem; opacity: 0.6; }
  }
`;

const EmptyState = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  opacity: 0.6;
`;

function CommandPalette({ isOpen, onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${config.API_BASE_URL}/api/courses`);
                setCourses(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCourses();
    }, []);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const searchResults = [];
        const q = query.toLowerCase();

        courses.forEach(course => {
            if (course.title.toLowerCase().includes(q)) {
                searchResults.push({ type: 'course', id: course.id, title: course.title, subtitle: 'Full Course' });
            }

            course.modules?.forEach(mod => {
                mod.lessons?.forEach(lesson => {
                    if (lesson.title.toLowerCase().includes(q)) {
                        searchResults.push({
                            type: 'lesson',
                            id: `${course.id}/learn`,
                            title: lesson.title,
                            subtitle: `Lesson in ${course.title}`,
                            courseId: course.id
                        });
                    }
                });
            });
        });

        setResults(searchResults.slice(0, 10));
        setSelectedIndex(0);
    }, [query, courses]);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter' && results[selectedIndex]) {
            handleSelect(results[selectedIndex]);
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    const handleSelect = (result) => {
        navigate(result.type === 'course' ? `/courses/${result.id}` : `/courses/${result.id}`);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <Overlay
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <Palette
                        initial={{ scale: 0.95, opacity: 0, y: -20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: -20 }}
                        onClick={e => e.stopPropagation()}
                        onKeyDown={handleKeyDown}
                    >
                        <SearchInputRow>
                            <FaSearch />
                            <input
                                ref={inputRef}
                                placeholder="Search courses, lessons, topics..."
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                            />
                            <kbd>ESC</kbd>
                        </SearchInputRow>

                        <ResultsList>
                            {results.length > 0 ? (
                                results.map((res, idx) => (
                                    <ResultItem
                                        key={`${res.type}-${res.id}-${idx}`}
                                        selected={idx === selectedIndex}
                                        isLesson={res.type === 'lesson'}
                                        onClick={() => handleSelect(res)}
                                    >
                                        <div className="icon-box">
                                            {res.type === 'lesson' ? <FaPlay /> : <FaBook />}
                                        </div>
                                        <div className="info">
                                            <h4>{res.title}</h4>
                                            <p>{res.subtitle}</p>
                                        </div>
                                    </ResultItem>
                                ))
                            ) : query ? (
                                <EmptyState>No results found for "{query}"</EmptyState>
                            ) : (
                                <EmptyState>Start typing to search...</EmptyState>
                            )}
                        </ResultsList>
                    </Palette>
                </Overlay>
            )}
        </AnimatePresence>
    );
}

export default CommandPalette;
