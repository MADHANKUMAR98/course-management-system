const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../utils/dataHelpers');

// Get all users
router.get('/users', (req, res) => {
    try {
        const users = readData('users.json');
        // Remove passwords from response
        const safeUsers = users.map(({ password, ...user }) => user);
        res.json(safeUsers);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get single user details
router.get('/users/:id', (req, res) => {
    try {
        const users = readData('users.json');
        const user = users.find(u => u.id === req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove password from response
        const { password, ...safeUser } = user;
        res.json(safeUser);
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete user
router.delete('/users/:id', (req, res) => {
    try {
        console.log(`Attempting to delete user with ID: ${req.params.id}`);
        const users = readData('users.json');
        const userIndex = users.findIndex(u => u.id === req.params.id);

        if (userIndex === -1) {
            console.log(`User with ID ${req.params.id} not found`);
            return res.status(404).json({ message: 'User not found' });
        }

        const deletedUser = users.splice(userIndex, 1)[0];
        const success = writeData('users.json', users);

        if (success) {
            console.log(`User ${deletedUser.name} deleted from users.json`);
            // Also cleanup their enrollments
            const enrollments = readData('enrollments.json');
            const filteredEnrollments = enrollments.filter(e => e.userId !== req.params.id);
            const enrollSuccess = writeData('enrollments.json', filteredEnrollments);

            if (!enrollSuccess) {
                console.error('Failed to cleanup enrollments, but user was deleted');
            }

            res.json({
                success: true,
                message: 'User deleted successfully',
                deletedUser: { id: deletedUser.id, name: deletedUser.name }
            });
        } else {
            console.error('Failed to write to users.json');
            res.status(500).json({ message: 'Failed to delete user' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all enrollments
router.get('/enrollments', (req, res) => {
    try {
        const enrollments = readData('enrollments.json');
        const users = readData('users.json');
        const courses = readData('courses.json');

        // Enrich enrollments with user and course details
        const enrichedEnrollments = enrollments.map(enrollment => {
            const user = users.find(u => u.id === enrollment.userId);
            const course = courses.find(c => c.id === enrollment.courseId);

            return {
                ...enrollment,
                userEmail: user ? user.email : 'Unknown',
                userName: user ? user.name : 'Unknown',
                courseTitle: course ? course.title : 'Unknown Course',
                coursePrice: course ? course.price : 0
            };
        });

        res.json(enrichedEnrollments);
    } catch (error) {
        console.error('Error getting enrollments:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get statistics
router.get('/stats', (req, res) => {
    try {
        const users = readData('users.json');
        const courses = readData('courses.json');
        const enrollments = readData('enrollments.json');

        const stats = {
            totalUsers: users.length,
            totalCourses: courses.length,
            totalEnrollments: enrollments.length,
            students: users.filter(u => u.role === 'student').length,
            admins: users.filter(u => u.role === 'admin').length,
            totalRevenue: enrollments.reduce((sum, e) => sum + (e.coursePrice || 0), 0),
            recentEnrollments: enrollments
                .sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt))
                .slice(0, 5),
            popularCourses: courses
                .sort((a, b) => (b.students || 0) - (a.students || 0))
                .slice(0, 3)
                .map(course => ({
                    title: course.title,
                    students: course.students || 0,
                    revenue: (course.students || 0) * (course.price || 0)
                }))
        };

        res.json(stats);
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get user activity
router.get('/activity', (req, res) => {
    try {
        const enrollments = readData('enrollments.json');

        // Group by date
        const activityByDate = {};
        enrollments.forEach(enrollment => {
            const date = enrollment.enrolledAt.split('T')[0];
            if (!activityByDate[date]) {
                activityByDate[date] = 0;
            }
            activityByDate[date]++;
        });

        // Convert to array and get last 7 days
        const last7Days = Object.entries(activityByDate)
            .sort((a, b) => b[0].localeCompare(a[0]))
            .slice(0, 7)
            .map(([date, count]) => ({ date, count }));

        res.json(last7Days);
    } catch (error) {
        console.error('Error getting activity:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all courses (admin view)
router.get('/courses', (req, res) => {
    try {
        const courses = readData('courses.json');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error getting courses' });
    }
});

// Create new course
router.post('/courses', (req, res) => {
    try {
        const courses = readData('courses.json');
        const newCourse = {
            ...req.body,
            id: Date.now().toString(),
            students: 0,
            rating: 5.0,
            modules: req.body.modules || []
        };
        courses.push(newCourse);
        writeData('courses.json', courses);
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(500).json({ message: 'Error creating course' });
    }
});

// Update course
router.put('/courses/:id', (req, res) => {
    try {
        const courses = readData('courses.json');
        const index = courses.findIndex(c => c.id === req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Course not found' });

        courses[index] = { ...courses[index], ...req.body, id: req.params.id };
        writeData('courses.json', courses);
        res.json(courses[index]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating course' });
    }
});

// Delete course
router.delete('/courses/:id', (req, res) => {
    try {
        const courses = readData('courses.json');
        const filtered = courses.filter(c => c.id !== req.params.id);
        writeData('courses.json', filtered);

        // Optional: cleanup enrollments
        const enrollments = readData('enrollments.json');
        const filteredEnrollments = enrollments.filter(e => e.courseId !== req.params.id);
        writeData('enrollments.json', filteredEnrollments);

        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting course' });
    }
});

module.exports = router;