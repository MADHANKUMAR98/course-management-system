const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function setupAdmin() {
    try {
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const adminUser = {
            id: '1',
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
            createdAt: new Date().toISOString()
        };
        
        const dataDir = path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        const usersPath = path.join(dataDir, 'users.json');
        let users = [];
        
        if (fs.existsSync(usersPath)) {
            const fileContent = fs.readFileSync(usersPath, 'utf8').trim();
            if (fileContent) {
                users = JSON.parse(fileContent);
            }
        }
        
        // Remove existing admin if exists
        users = users.filter(user => user.email !== 'admin@example.com');
        users.push(adminUser);
        
        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
        
        console.log('Admin user created successfully!');
        console.log('Email: admin@example.com');
        console.log('Password: admin123');
    } catch (error) {
        console.error('Error setting up admin:', error);
    }
}

setupAdmin();