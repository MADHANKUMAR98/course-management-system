const express = require('express');
const router = express.Router();
const { readData, writeData, initializeCoursesIfEmpty } = require('../utils/dataHelpers');

// Get all courses
router.get('/', (req, res) => {
    try {
        // Initialize courses if empty
        const courses = initializeCoursesIfEmpty();
        res.json(courses);
    } catch (error) {
        console.error('Error getting courses:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get course by ID
router.get('/:id', (req, res) => {
    try {
        const courses = readData('courses.json');
        const course = courses.find(c => c.id === req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json(course);
    } catch (error) {
        console.error('Error getting course:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Enroll in a course
router.post('/:id/enroll', (req, res) => {
    try {
        const { userId, userName } = req.body;
        const courseId = req.params.id;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const courses = readData('courses.json');
        const course = courses.find(c => c.id === courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const enrollments = readData('enrollments.json');

        // Check if already enrolled
        const existingEnrollment = enrollments.find(e => e.userId === userId && e.courseId === courseId);
        if (existingEnrollment) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        const newEnrollment = {
            id: Date.now().toString(),
            userId,
            userName: userName || 'Student',
            courseId,
            courseTitle: course.title,
            coursePrice: course.price,
            enrolledAt: new Date().toISOString(),
            progress: 0,
            completedLessons: [],
            completed: false,
            lastAccessed: new Date().toISOString()
        };

        enrollments.push(newEnrollment);
        const writeSuccess = writeData('enrollments.json', enrollments);

        if (!writeSuccess) {
            return res.status(500).json({ message: 'Failed to save enrollment' });
        }

        // Update course student count
        const courseIndex = courses.findIndex(c => c.id === courseId);
        if (courseIndex !== -1) {
            courses[courseIndex].students = (courses[courseIndex].students || 0) + 1;
            writeData('courses.json', courses);
        }

        res.json({
            message: 'Successfully enrolled in course',
            enrollment: newEnrollment
        });
    } catch (error) {
        console.error('Enrollment error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get user enrollments
router.get('/user/:userId/enrollments', (req, res) => {
    try {
        const enrollments = readData('enrollments.json');
        const userEnrollments = enrollments.filter(e => e.userId === req.params.userId);

        // Get course details for each enrollment
        const courses = readData('courses.json');
        const enrichedEnrollments = userEnrollments.map(enrollment => {
            const course = courses.find(c => c.id === enrollment.courseId);
            return {
                ...enrollment,
                course: course || null
            };
        });

        res.json(enrichedEnrollments);
    } catch (error) {
        console.error('Error getting enrollments:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update lesson progress
router.post('/:id/progress', (req, res) => {
    try {
        const { userId, lessonId, isCompleted } = req.body;
        const courseId = req.params.id;

        const enrollments = readData('enrollments.json');
        const enrollIdx = enrollments.findIndex(e => e.userId === userId && e.courseId === courseId);

        if (enrollIdx === -1) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }

        const courses = readData('courses.json');
        const course = courses.find(c => c.id === courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Initialize completedLessons if it doesn't exist
        if (!enrollments[enrollIdx].completedLessons) {
            enrollments[enrollIdx].completedLessons = [];
        }

        const completedLessons = enrollments[enrollIdx].completedLessons;

        if (isCompleted) {
            if (!completedLessons.includes(lessonId)) {
                completedLessons.push(lessonId);
            }
        } else {
            const index = completedLessons.indexOf(lessonId);
            if (index > -1) {
                completedLessons.splice(index, 1);
            }
        }

        // Calculate total lessons in course
        let totalLessons = 0;
        course.modules.forEach(m => {
            totalLessons += Array.isArray(m.lessons) ? m.lessons.length : (m.lessons || 0);
        });

        // Update progress percentage
        enrollments[enrollIdx].progress = Math.round((completedLessons.length / totalLessons) * 100);
        enrollments[enrollIdx].completed = enrollments[enrollIdx].progress === 100;
        enrollments[enrollIdx].lastAccessed = new Date().toISOString();

        writeData('enrollments.json', enrollments);

        res.json({
            message: 'Progress updated',
            progress: enrollments[enrollIdx].progress,
            completedLessons: completedLessons,
            completed: enrollments[enrollIdx].completed
        });
    } catch (error) {
        console.error('Progress update error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get specific enrollment for course player
router.get('/:id/enrollment/:userId', (req, res) => {
    try {
        const { id: courseId, userId } = req.params;
        const enrollments = readData('enrollments.json');
        const enrollment = enrollments.find(e => e.userId === userId && e.courseId === courseId);

        if (!enrollment) {
            return res.status(404).json({ message: 'Not enrolled in this course' });
        }

        res.json(enrollment);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get featured courses (for homepage)
router.get('/featured/random', (req, res) => {
    try {
        const courses = readData('courses.json');
        // Return 3 random courses
        const shuffled = [...courses].sort(() => 0.5 - Math.random());
        const featured = shuffled.slice(0, 3);
        res.json(featured);
    } catch (error) {
        console.error('Error getting featured courses:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;