const WebSocket = require('ws');

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });
  const connectedUsers = new Map();

  wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection');
    
    // Get user ID from query parameters (you'll need to implement authentication)
    const userId = req.url.split('userId=')[1] || 'anonymous';
    
    // Store connection
    connectedUsers.set(userId, ws);
    
    // Send welcome
    ws.send(JSON.stringify({
      type: 'welcome',
      message: 'Connected to real-time updates',
      userId,
      timestamp: new Date().toISOString()
    }));

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        console.log('Received:', data);
        
        // Echo back for now
        ws.send(JSON.stringify({
          type: 'echo',
          data: data,
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    ws.on('close', () => {
      connectedUsers.delete(userId);
      console.log(`User ${userId} disconnected`);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  // Helper functions
  function sendToUser(userId, data) {
    const ws = connectedUsers.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  function broadcast(data) {
    connectedUsers.forEach((ws, userId) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      }
    });
  }

  return { sendToUser, broadcast };
}

module.exports = setupWebSocket;