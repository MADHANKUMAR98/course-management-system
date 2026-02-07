const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../utils/dataHelpers');

// Get user achievements
router.get('/user/:userId/achievements', (req, res) => {
  try {
    const users = readData('users.json');
    const user = users.find(u => u.id === req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const achievements = user.achievements || [
      {
        id: '1',
        title: 'First Step',
        description: 'Complete your first course',
        icon: '🚀',
        earned: true,
        earnedAt: new Date().toISOString(),
        points: 100
      },
      {
        id: '2',
        title: 'Quick Learner',
        description: 'Complete 3 courses in one month',
        icon: '⚡',
        earned: false,
        points: 250
      },
      {
        id: '3',
        title: 'Perfect Score',
        description: 'Score 100% on 5 quizzes',
        icon: '🎯',
        earned: false,
        points: 300
      },
      {
        id: '4',
        title: 'Social Butterfly',
        description: 'Join 3 discussion groups',
        icon: '🦋',
        earned: true,
        earnedAt: new Date().toISOString(),
        points: 150
      }
    ];

    // Calculate total points
    const totalPoints = achievements
      .filter(a => a.earned)
      .reduce((sum, a) => sum + a.points, 0);

    res.json({
      achievements,
      totalPoints,
      level: Math.floor(totalPoints / 1000) + 1,
      nextLevelPoints: 1000 - (totalPoints % 1000)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Award achievement
router.post('/user/:userId/award', (req, res) => {
  try {
    const { achievementId } = req.body;
    const users = readData('users.json');
    const userIndex = users.findIndex(u => u.id === req.params.userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!users[userIndex].achievements) {
      users[userIndex].achievements = [];
    }

    // Check if already earned
    if (users[userIndex].achievements.find(a => a.id === achievementId && a.earned)) {
      return res.status(400).json({ message: 'Achievement already earned' });
    }

    const achievement = users[userIndex].achievements.find(a => a.id === achievementId);
    if (achievement) {
      achievement.earned = true;
      achievement.earnedAt = new Date().toISOString();
    } else {
      users[userIndex].achievements.push({
        id: achievementId,
        title: req.body.title || 'New Achievement',
        description: req.body.description || '',
        icon: req.body.icon || '🏆',
        earned: true,
        earnedAt: new Date().toISOString(),
        points: req.body.points || 100
      });
    }

    writeData('users.json', users);

    // Notify via WebSocket if available
    const websocket = req.app.get('websocket');
    if (websocket) {
      websocket.sendToUser(req.params.userId, {
        type: 'achievement_unlocked',
        achievement: achievement || { id: achievementId, title: req.body.title },
        timestamp: new Date().toISOString()
      });
    }

    res.json({ 
      message: 'Achievement awarded!',
      achievement: users[userIndex].achievements.find(a => a.id === achievementId)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', (req, res) => {
  try {
    const users = readData('users.json');
    
    const leaderboard = users
      .map(user => {
        const achievements = user.achievements || [];
        const points = achievements
          .filter(a => a.earned)
          .reduce((sum, a) => sum + a.points, 0);
        
        return {
          userId: user.id,
          name: user.name,
          email: user.email,
          points,
          level: Math.floor(points / 1000) + 1,
          achievementsCount: achievements.filter(a => a.earned).length
        };
      })
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;