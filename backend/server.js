const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');
const setupWebSocket = require('./websocket');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const adminRoutes = require('./routes/admin');

const app = express();
const server = http.createServer(app);
const PORT = 5000;

// Handle WebSocket gracefully (not supported in standard Vercel serverless)
let wsHandlers = { sendToUser: () => { }, broadcast: () => { } };
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  try {
    wsHandlers = setupWebSocket(server);
  } catch (e) {
    console.warn('WebSocket setup failed:', e.message);
  }
}

const { sendToUser, broadcast } = wsHandlers;

// Middleware
app.use(cors());
app.use(express.json());

// Create data directory
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
  } catch (e) {
    console.warn('Could not create data directory (likely read-only)');
  }
}

// Initialize files
const initFiles = () => {
  const files = ['users.json', 'courses.json', 'enrollments.json'];
  files.forEach(file => {
    const filePath = path.join(dataDir, file);
    if (!fs.existsSync(filePath)) {
      try {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      } catch (e) {
        console.warn(`Could not initialize ${file} (read-only)`);
      }
    }
  });
};
initFiles();

// Test route
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/auth/login',
      '/api/auth/register',
      '/api/courses',
      '/api/admin/users'
    ]
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes);

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Only start the server if we're not running in a serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const actualPort = process.env.PORT || PORT;
  server.listen(actualPort, () => {
    console.log(`✅ Backend server running on http://localhost:${actualPort}`);
  });
}

module.exports = app;