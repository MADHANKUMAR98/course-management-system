import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';
import config from '../config';
import {
    FaChevronLeft,
    FaCheckCircle,
    FaRegCircle,
    FaPlay,
    FaBookOpen,
    FaCertificate,
    FaArrowLeft,
    FaArrowRight,
    FaBars
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { generateCertificate } from '../utils/certificateGenerator';

const QuizContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const QuestionCard = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const OptionButton = styled.button`
  width: 100%;
  text-align: left;
  padding: 1.2rem 1.5rem;
  border-radius: 12px;
  border: 2px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.active ? 'rgba(102, 126, 234, 0.1)' : 'transparent'};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: rgba(102, 126, 234, 0.05);
  }
`;

const PlayerContainer = styled.div`
  display: flex;
  height: calc(100vh - 80px);
  background: ${props => props.theme.colors.background};
  overflow: hidden;

  @media (max-width: 1024px) {
    flex-direction: column;
    height: auto;
  }
`;

const Sidebar = styled(motion.div)`
  width: 350px;
  background: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  z-index: 10;

  @media (max-width: 1024px) {
    width: 100%;
    max-height: 400px;
  }
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.gradients.primary};
  color: white;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ModuleList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ModuleItem = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ModuleHeader = styled.div`
  padding: 1.2rem 1.5rem;
  background: ${props => props.active ? 'rgba(102, 126, 234, 0.05)' : 'transparent'};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  border-left: 4px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};

  &:hover {
    background: rgba(102, 126, 234, 0.05);
  }
`;

const LessonItem = styled.div`
  padding: 1rem 1.5rem 1rem 2.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  background: ${props => props.active ? 'rgba(102, 126, 234, 0.1)' : 'transparent'};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.textSecondary};
  transition: all 0.2s;

  &:hover {
    background: rgba(102, 126, 234, 0.05);
    color: ${props => props.theme.colors.primary};
  }

  svg {
    font-size: 0.9rem;
    color: ${props => props.completed ? '#2ed573' : 'inherit'};
  }
`;

const VideoPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.theme.shadows.xl};
`;

const PlayerControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => props.theme.colors.surface};
  padding: 1.5rem 2rem;
  border-radius: 15px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.primary ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.primary ? 'white' : props.theme.colors.text};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const CompleteButton = styled(NavButton)`
  background: ${props => props.completed ? '#2ed573' : props.theme.colors.primary};
  color: white;
  border: none;
`;

const LessonTitle = styled.h1`
  font-size: 2.2rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const LessonDescription = styled.div`
  font-size: 1.1rem;
  line-height: 1.7;
  color: ${props => props.theme.colors.textSecondary};
  background: ${props => props.theme.colors.surface};
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const CertificateCard = styled(motion.div)`
  background: ${props => props.theme.gradients.primary};
  padding: 3rem;
  border-radius: 30px;
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.4);
`;

function CoursePlayer() {
    const { id: courseId } = useParams();
    const { user } = useContext(AuthContext);
    const { theme } = useTheme();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [enrollment, setEnrollment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeLesson, setActiveLesson] = useState(null);
    const [expandedModules, setExpandedModules] = useState({});
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizScore, setQuizScore] = useState(0);

    useEffect(() => {
        if (user && courseId) {
            fetchData();
        }
    }, [user, courseId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [courseRes, enrollRes] = await Promise.all([
                axios.get(`${config.API_BASE_URL}/api/courses/${courseId}`),
                axios.get(`${config.API_BASE_URL}/api/courses/${courseId}/enrollment/${user.id}`)
            ]);

            setCourse(courseRes.data);
            setEnrollment(enrollRes.data);

            // Set first lesson as active if none selected
            if (activeLesson === null && courseRes.data.modules.length > 0 && courseRes.data.modules[0].lessons.length > 0) {
                setActiveLesson(courseRes.data.modules[0].lessons[0]);
                setExpandedModules({ [courseRes.data.modules[0].id]: true });
            }
        } catch (error) {
            console.error('Error fetching player data:', error);
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionId, optionIndex) => {
        setQuizAnswers({ ...quizAnswers, [questionId]: optionIndex });
    };

    const submitQuiz = () => {
        if (!activeLesson.questions) return;

        let correctCount = 0;
        activeLesson.questions.forEach(q => {
            if (quizAnswers[q.id] === q.correct) correctCount++;
        });

        const score = (correctCount / activeLesson.questions.length) * 100;
        setQuizScore(score);
        setQuizSubmitted(true);

        if (score >= 80) {
            handleLessonToggle(activeLesson.id, true);
        }
    };

    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    const handleLessonToggle = async (lessonId, isCompleted) => {
        try {
            const res = await axios.post(`${config.API_BASE_URL}/api/courses/${courseId}/progress`, {
                userId: user.id,
                lessonId,
                isCompleted
            });

            setEnrollment(prev => ({
                ...prev,
                progress: res.data.progress,
                completedLessons: res.data.completedLessons,
                completed: res.data.completed
            }));
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const findNextLesson = () => {
        if (!course || !activeLesson) return null;
        let found = false;
        for (const module of course.modules) {
            for (const lesson of module.lessons) {
                if (found) return lesson;
                if (lesson.id === activeLesson.id) found = true;
            }
        }
        return null;
    };

    const findPrevLesson = () => {
        if (!course || !activeLesson) return null;
        let prev = null;
        for (const module of course.modules) {
            for (const lesson of module.lessons) {
                if (lesson.id === activeLesson.id) return prev;
                prev = lesson;
            }
        }
        return null;
    };

    const nextLesson = findNextLesson();
    const prevLesson = findPrevLesson();

    if (loading) return <div>Loading Player...</div>;
    if (!course) return <div>Course not found</div>;

    const isLessonCompleted = (lessonId) => {
        return enrollment?.completedLessons?.includes(lessonId);
    };

    return (
        <PlayerContainer>
            <Sidebar
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
            >
                <SidebarHeader>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <FaArrowLeft onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }} />
                        <span style={{ fontWeight: 800 }}>Course Content</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                        Your Progress: {enrollment?.progress || 0}%
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', marginTop: '0.5rem', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: 'white', width: `${enrollment?.progress || 0}%`, transition: 'width 0.5s' }} />
                    </div>
                </SidebarHeader>

                <ModuleList>
                    {course.modules.map((module) => (
                        <ModuleItem key={module.id}>
                            <ModuleHeader
                                onClick={() => toggleModule(module.id)}
                                active={activeLesson && module.lessons.some(l => l.id === activeLesson.id)}
                            >
                                {module.title}
                                <FaBars style={{ opacity: 0.5 }} />
                            </ModuleHeader>
                            <AnimatePresence>
                                {expandedModules[module.id] && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        {module.lessons.map((lesson) => (
                                            <LessonItem
                                                key={lesson.id}
                                                active={activeLesson?.id === lesson.id}
                                                completed={isLessonCompleted(lesson.id)}
                                                onClick={() => setActiveLesson(lesson)}
                                            >
                                                {isLessonCompleted(lesson.id) ? <FaCheckCircle /> : <FaRegCircle />}
                                                {lesson.title}
                                            </LessonItem>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </ModuleItem>
                    ))}
                </ModuleList>
            </Sidebar>

            <ContentArea>
                {activeLesson && (
                    <motion.div
                        key={activeLesson.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
                    >
                        {activeLesson.type === 'video' ? (
                            <VideoPlaceholder>
                                <div style={{ textAlign: 'center' }}>
                                    <FaPlay style={{ fontSize: '4rem', color: 'white', opacity: 0.8 }} />
                                    <p style={{ color: 'white', marginTop: '1rem' }}>Video Content Placeholder: {activeLesson.title}</p>
                                </div>
                            </VideoPlaceholder>
                        ) : activeLesson.type === 'quiz' ? (
                            <QuizContainer>
                                <h2 style={{ marginBottom: '2rem' }}>Knowledge Check: {activeLesson.title}</h2>
                                {!quizSubmitted ? (
                                    activeLesson.questions?.map((q, idx) => (
                                        <QuestionCard key={q.id}>
                                            <p style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '1.5rem' }}>{idx + 1}. {q.question}</p>
                                            <div style={{ display: 'grid', gap: '1rem' }}>
                                                {q.options.map((opt, optIdx) => (
                                                    <OptionButton
                                                        key={optIdx}
                                                        active={quizAnswers[q.id] === optIdx}
                                                        onClick={() => handleAnswerSelect(q.id, optIdx)}
                                                    >
                                                        {opt}
                                                    </OptionButton>
                                                ))}
                                            </div>
                                        </QuestionCard>
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        style={{ textAlign: 'center', padding: '3rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '20px' }}
                                    >
                                        <h3 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Your Score: {quizScore}%</h3>
                                        <p style={{ fontSize: '1.2rem', color: quizScore >= 80 ? '#2ed573' : '#ff4757', fontWeight: 700 }}>
                                            {quizScore >= 80 ? 'Mastered! You can move forward.' : 'Keep studying and try again to pass (80% required).'}
                                        </p>
                                        <NavButton
                                            primary
                                            style={{ marginTop: '2rem', display: 'inline-flex' }}
                                            onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }}
                                        >
                                            Retake Quiz
                                        </NavButton>
                                    </motion.div>
                                )}
                                {!quizSubmitted && (
                                    <NavButton
                                        primary
                                        style={{ width: '100%', marginTop: '2rem', padding: '1.5rem' }}
                                        onClick={submitQuiz}
                                        disabled={Object.keys(quizAnswers).length < (activeLesson.questions?.length || 0)}
                                    >
                                        Submit Assessment
                                    </NavButton>
                                )}
                            </QuizContainer>
                        ) : (
                            <div style={{ background: theme.gradients.primary, height: '200px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                <FaBookOpen style={{ fontSize: '4rem' }} />
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <LessonTitle>{activeLesson.title}</LessonTitle>
                                <p style={{ color: theme.colors.textSecondary }}>Type: {activeLesson.type.toUpperCase()} • Duration: {activeLesson.duration}</p>
                            </div>
                            <CompleteButton
                                completed={isLessonCompleted(activeLesson.id)}
                                onClick={() => handleLessonToggle(activeLesson.id, !isLessonCompleted(activeLesson.id))}
                            >
                                {isLessonCompleted(activeLesson.id) ? (
                                    <><FaCheckCircle /> Completed</>
                                ) : (
                                    'Mark as Complete'
                                )}
                            </CompleteButton>
                        </div>

                        <LessonDescription>
                            {activeLesson.content}
                        </LessonDescription>

                        <PlayerControls>
                            <NavButton
                                disabled={!prevLesson}
                                onClick={() => prevLesson && setActiveLesson(prevLesson)}
                            >
                                <FaArrowLeft /> Previous Lesson
                            </NavButton>

                            {enrollment?.completed && (
                                <NavButton primary onClick={() => generateCertificate(user.name, course.title, new Date().toISOString())}>
                                    <FaCertificate /> Download Certificate
                                </NavButton>
                            )}

                            <NavButton
                                disabled={!nextLesson}
                                onClick={() => nextLesson && setActiveLesson(nextLesson)}
                            >
                                Next Lesson <FaArrowRight />
                            </NavButton>
                        </PlayerControls>
                    </motion.div>
                )}

                {enrollment?.progress === 100 && (
                    <CertificateCard
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <FaCertificate style={{ fontSize: '5rem' }} />
                        <div>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Congratulations!</h2>
                            <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>You have successfully completed this course.</p>
                        </div>
                        <button
                            onClick={() => generateCertificate(user.name, course.title, new Date().toISOString())}
                            style={{
                                background: 'white',
                                color: theme.colors.primary,
                                border: 'none',
                                padding: '1rem 2.5rem',
                                borderRadius: '50px',
                                fontWeight: '800',
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                            }}
                        >
                            Get Your Certificate
                        </button>
                    </CertificateCard>
                )}
            </ContentArea>
        </PlayerContainer>
    );
}

export default CoursePlayer;
