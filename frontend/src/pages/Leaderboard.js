import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaMedal, FaCrown, FaStar, FaFire, FaRocket } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const LeaderboardContainer = styled(motion.div)`
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;

  h1 {
    font-size: clamp(2.2rem, 8vw, 4rem);
    font-weight: 900;
    margin-bottom: 1rem;
    background: ${props => props.theme.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    color: ${props => props.theme.colors.textSecondary};
    font-size: clamp(1rem, 3vw, 1.2rem);
  }

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const TopThreeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  align-items: flex-end;
  margin-bottom: 5rem;
  padding: 0 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 4rem;
    padding: 0 1rem;
    align-items: center;
  }
`;

const PodiumCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: 30px;
  padding: 2rem;
  text-align: center;
  position: relative;
  box-shadow: ${props => props.theme.shadows.xl};
  border: 4px solid ${props => props.isFirst ? '#ffd700' : props.isSecond ? '#c0c0c0' : '#cd7f32'};
  height: ${props => props.isFirst ? '350px' : props.isSecond ? '300px' : '280px'};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 1024px) {
    height: auto;
    padding: 4rem 2rem 2.5rem;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }

  .rank-icon {
    position: absolute;
    top: -30px;
    font-size: 3rem;
    color: ${props => props.isFirst ? '#ffd700' : props.isSecond ? '#c0c0c0' : '#cd7f32'};
    filter: drop-shadow(0 5px 15px rgba(0,0,0,0.2));
  }
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: ${props => props.gradient};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  font-weight: 800;
  border: 5px solid white;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
`;

const Name = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const Score = styled.div`
  font-size: 2rem;
  font-weight: 900;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    font-size: 1rem;
    color: ${props => props.theme.colors.textSecondary};
    font-weight: 600;
  }
`;

const TableContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 30px;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 20px;
  }
`;

const LeaderTableRow = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  gap: 2rem;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 1.5rem;
    padding: 2rem 1.5rem;
  }

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.theme.colors.glass};
    transform: scale(1.02);
    border-radius: 15px;
  }
`;

const Rank = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${props => props.theme.colors.textSecondary};
  width: 40px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex: 1;

  .small-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: ${props => props.gradient};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 1.2rem;
  }

  span {
    font-weight: 600;
    font-size: 1.1rem;
    color: ${props => props.theme.colors.text};
  }
`;

const StatsGrid = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 1024px) {
    width: 100%;
    justify-content: flex-start;
    gap: 2rem;
    margin-top: 1rem;
  }
`;

const MiniStat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.color};
  font-weight: 700;
  font-size: 1.1rem;

  svg {
    font-size: 1rem;
  }
`;

function Leaderboard() {
    const { theme } = useTheme();

    const leaders = [
        { name: 'Alex Rivera', score: 12500, rank: 1, avatar: 'AR', avatarGradient: 'linear-gradient(45deg, #ff9a9e, #fad0c4)', streak: 15, level: 42 },
        { name: 'Sarah Chen', score: 11200, rank: 2, avatar: 'SC', avatarGradient: 'linear-gradient(45deg, #a1c4fd, #c2e9fb)', streak: 8, level: 38 },
        { name: 'Marcus Bell', score: 10800, rank: 3, avatar: 'MB', avatarGradient: 'linear-gradient(45deg, #84fab0, #8fd3f4)', streak: 12, level: 35 },
        { name: 'Emma Wilson', score: 9500, rank: 4, avatar: 'EW', avatarGradient: 'linear-gradient(45deg, #fccb90, #d57eeb)', streak: 5, level: 31 },
        { name: 'David Kim', score: 8900, rank: 5, avatar: 'DK', avatarGradient: 'linear-gradient(45deg, #e0c3fc, #8ec5fc)', streak: 20, level: 29 },
        { name: 'Lena Thorne', score: 8200, rank: 6, avatar: 'LT', avatarGradient: 'linear-gradient(45deg, #f6d365, #fda085)', streak: 3, level: 27 },
        { name: 'Jordan Hayes', score: 7500, rank: 7, avatar: 'JH', avatarGradient: 'linear-gradient(45deg, #4facfe, #00f2fe)', streak: 10, level: 25 },
    ];

    return (
        <LeaderboardContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Header>
                <motion.h1
                    initial={{ y: -50 }}
                    animate={{ y: 0 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                >
                    World Class Learners
                </motion.h1>
                <p>Top students this month across all categories</p>
            </Header>

            <TopThreeGrid>
                {/* Second Place */}
                <PodiumCard
                    isSecond
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                >
                    <div className="rank-icon"><FaMedal /></div>
                    <Avatar gradient={leaders[1].avatarGradient}>{leaders[1].avatar}</Avatar>
                    <Name>{leaders[1].name}</Name>
                    <Score>{leaders[1].score.toLocaleString()} <span>PTS</span></Score>
                </PodiumCard>

                {/* First Place */}
                <PodiumCard
                    isFirst
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                >
                    <div className="rank-icon"><FaCrown /></div>
                    <Avatar gradient={leaders[0].avatarGradient}>{leaders[0].avatar}</Avatar>
                    <Name>{leaders[0].name}</Name>
                    <Score>{leaders[0].score.toLocaleString()} <span>PTS</span></Score>
                </PodiumCard>

                {/* Third Place */}
                <PodiumCard
                    isThird
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                >
                    <div className="rank-icon"><FaMedal /></div>
                    <Avatar gradient={leaders[2].avatarGradient}>{leaders[2].avatar}</Avatar>
                    <Name>{leaders[2].name}</Name>
                    <Score>{leaders[2].score.toLocaleString()} <span>PTS</span></Score>
                </PodiumCard>
            </TopThreeGrid>

            <TableContainer>
                <AnimatePresence>
                    {leaders.slice(3).map((user, index) => (
                        <LeaderTableRow
                            key={user.rank}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                        >
                            <Rank>#{user.rank}</Rank>
                            <UserInfo gradient={user.avatarGradient}>
                                <div className="small-avatar">{user.avatar}</div>
                                <span>{user.name}</span>
                            </UserInfo>
                            <StatsGrid>
                                <MiniStat color="#ff4757">
                                    <FaFire /> {user.streak}d
                                </MiniStat>
                                <MiniStat color="#2ed573">
                                    <FaRocket /> Lvl {user.level}
                                </MiniStat>
                                <Score style={{ fontSize: '1.2rem' }}>
                                    {user.score.toLocaleString()} <span>PTS</span>
                                </Score>
                            </StatsGrid>
                        </LeaderTableRow>
                    ))}
                </AnimatePresence>
            </TableContainer>
        </LeaderboardContainer>
    );
}

export default Leaderboard;
