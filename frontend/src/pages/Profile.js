import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaShieldAlt, FaCalendarAlt, FaCamera, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ProfileContainer = styled(motion.div)`
  padding: 4rem 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const ProfileCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 30px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.xl};
  border: 1px solid ${props => props.theme.colors.border};
`;

const ProfileHeader = styled.div`
  height: 200px;
  background: ${props => props.theme.gradients.primary};
  position: relative;
`;

const AvatarContainer = styled.div`
  position: absolute;
  bottom: -60px;
  left: 50px;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: ${props => props.theme.colors.surface};
  padding: 5px;
  box-shadow: ${props => props.theme.shadows.lg};
`;

const Avatar = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: ${props => props.theme.gradients.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: white;
  font-weight: 800;
  position: relative;
`;

const CameraIcon = styled.div`
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: ${props => props.theme.colors.primary};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  border: 4px solid ${props => props.theme.colors.surface};
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const ProfileBody = styled.div`
  padding: 80px 50px 50px;
`;

const ProfileInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 3rem;
`;

const UserDetails = styled.div`
  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: ${props => props.theme.colors.text};
  }

  p {
    color: ${props => props.theme.colors.textSecondary};
    font-size: 1.1rem;
  }
`;

const EditButton = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const InfoCard = styled.div`
  padding: 1.5rem;
  background: ${props => props.theme.colors.background};
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const IconWrapper = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 15px;
  background: ${props => props.theme.colors.glass};
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const InfoContent = styled.div`
  p {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: 0.2rem;
  }
  h4 {
    font-size: 1.1rem;
    color: ${props => props.theme.colors.text};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
`;

function Profile() {
    const { user } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    if (!user) return <div>Please log in to view your profile.</div>;

    const handleToggleEdit = () => {
        if (isEditing) {
            // Save logic here (mock)
            console.log('Saving profile...', formData);
        }
        setIsEditing(!isEditing);
    };

    return (
        <ProfileContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <ProfileCard>
                <ProfileHeader>
                    <AvatarContainer>
                        <Avatar>
                            {user.name.charAt(0).toUpperCase()}
                            <CameraIcon>
                                <FaCamera />
                            </CameraIcon>
                        </Avatar>
                    </AvatarContainer>
                </ProfileHeader>

                <ProfileBody>
                    <ProfileInfo>
                        <UserDetails>
                            {isEditing ? (
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{ fontSize: '2.5rem', fontWeight: 'bold' }}
                                />
                            ) : (
                                <h1>{user.name}</h1>
                            )}
                            <p>Learning Journey Since Jan 2024</p>
                        </UserDetails>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <EditButton
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleToggleEdit}
                                style={{ background: isEditing ? '#2ed573' : '' }}
                            >
                                {isEditing ? <><FaSave /> Save</> : <><FaEdit /> Edit Profile</>}
                            </EditButton>
                            {isEditing && (
                                <EditButton
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsEditing(false)}
                                    style={{ background: '#ff4757' }}
                                >
                                    <FaTimes /> Cancel
                                </EditButton>
                            )}
                        </div>
                    </ProfileInfo>

                    <InfoGrid>
                        <InfoCard>
                            <IconWrapper><FaEnvelope /></IconWrapper>
                            <InfoContent>
                                <p>Email Address</p>
                                {isEditing ? (
                                    <Input
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                ) : (
                                    <h4>{user.email}</h4>
                                )}
                            </InfoContent>
                        </InfoCard>

                        <InfoCard>
                            <IconWrapper><FaShieldAlt /></IconWrapper>
                            <InfoContent>
                                <p>Role</p>
                                <h4>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</h4>
                            </InfoContent>
                        </InfoCard>

                        <InfoCard>
                            <IconWrapper><FaCalendarAlt /></IconWrapper>
                            <InfoContent>
                                <p>Member Since</p>
                                <h4>January 15, 2024</h4>
                            </InfoContent>
                        </InfoCard>

                        <InfoCard>
                            <IconWrapper><FaUser /></IconWrapper>
                            <InfoContent>
                                <p>Account Status</p>
                                <h4 style={{ color: '#2ed573' }}>Active</h4>
                            </InfoContent>
                        </InfoCard>
                    </InfoGrid>
                </ProfileBody>
            </ProfileCard>
        </ProfileContainer>
    );
}

export default Profile;
