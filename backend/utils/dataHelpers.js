const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

// Helper function to read data with error handling
const readData = (filename) => {
    try {
        const filePath = path.join(dataDir, filename);
        if (!fs.existsSync(filePath)) {
            // Return empty array if file doesn't exist
            return [];
        }
        
        const fileContent = fs.readFileSync(filePath, 'utf8').trim();
        
        // If file is empty, return empty array
        if (!fileContent) {
            return [];
        }
        
        const data = JSON.parse(fileContent);
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error(`Error reading ${filename}:`, error.message);
        // Return empty array on error
        return [];
    }
};

// Helper function to write data
const writeData = (filename, data) => {
    try {
        const filePath = path.join(dataDir, filename);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${filename}:`, error.message);
        return false;
    }
};

// Initialize sample courses if empty
const initializeCoursesIfEmpty = () => {
    const courses = readData('courses.json');
    if (courses.length === 0) {
        const sampleCourses = [
            {
                id: '1',
                title: 'Full Stack Web Development',
                description: 'Learn to build modern web applications with React and Node.js',
                instructor: 'John Doe',
                price: 49.99,
                category: 'Web Development',
                rating: 4.7,
                students: 1250,
                duration: '40 hours',
                level: 'Intermediate',
                image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop',
                modules: [
                    {
                        id: '1',
                        title: 'Introduction to Web Development',
                        lessons: 5,
                        duration: '2 hours'
                    },
                    {
                        id: '2',
                        title: 'React Fundamentals',
                        lessons: 8,
                        duration: '6 hours'
                    },
                    {
                        id: '3',
                        title: 'Node.js & Express',
                        lessons: 7,
                        duration: '5 hours'
                    }
                ]
            },
            {
                id: '2',
                title: 'Data Science Masterclass',
                description: 'Complete guide to data science with Python and ML',
                instructor: 'Jane Smith',
                price: 59.99,
                category: 'Data Science',
                rating: 4.8,
                students: 890,
                duration: '50 hours',
                level: 'Advanced',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
                modules: [
                    {
                        id: '1',
                        title: 'Python for Data Science',
                        lessons: 6,
                        duration: '4 hours'
                    },
                    {
                        id: '2',
                        title: 'Machine Learning Basics',
                        lessons: 10,
                        duration: '8 hours'
                    }
                ]
            }
        ];
        writeData('courses.json', sampleCourses);
        return sampleCourses;
    }
    return courses;
};

module.exports = {
    readData,
    writeData,
    initializeCoursesIfEmpty
};