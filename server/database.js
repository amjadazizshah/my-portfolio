const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'portfolio.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Database connected.');
        
        // Ensure uploads directory exists
        const uploadsDir = path.resolve(__dirname, 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
        }
        
        // Create tables
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )`, (err) => {
            if (!err) {
                // Insert default admin user if none exists
                db.get(`SELECT * FROM users WHERE username = ?`, ['admin'], (err, row) => {
                    if (!row) {
                        const hash = bcrypt.hashSync('admin123', 10);
                        db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, ['admin', hash]);
                        console.log('Default admin user created (admin / admin123)');
                    }
                });
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            tags TEXT,
            imageUrl TEXT,
            link TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS blogs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            date TEXT,
            excerpt TEXT,
            content TEXT,
            imageUrl TEXT
        )`);
        
        // Insert sample data if tables are empty
        db.get(`SELECT COUNT(*) as count FROM projects`, [], (err, row) => {
            if (row && row.count === 0) {
                const sampleProjects = [
                    { title: 'LUNA-AI CHAT APPLICATION', description: 'A full-stack AI chatbot application featuring real-time, multi-model AI conversations.', tags: ['React Native', 'Node.js', 'Groq AI APIs'], imageUrl: '' },
                    { title: 'BLOG MANAGEMENT WEBSITE', description: 'A full-stack blog management system with secure user authentication.', tags: ['Python', 'Django', 'HTML/CSS'], imageUrl: '' },
                    { title: 'RISEL GROWTH AGENCY WEBSITE', description: 'A responsive digital agency website with an integrated AI chatbot.', tags: ['React.js', 'Node.js', 'Tailwind CSS'], imageUrl: '' }
                ];
                sampleProjects.forEach(p => {
                    db.run(`INSERT INTO projects (title, description, tags, imageUrl) VALUES (?, ?, ?, ?)`, [p.title, p.description, JSON.stringify(p.tags), p.imageUrl]);
                });
            }
        });
        
        db.get(`SELECT COUNT(*) as count FROM blogs`, [], (err, row) => {
            if (row && row.count === 0) {
                const sampleBlogs = [
                    { title: 'My Journey into Software Engineering', date: 'Oct 15, 2023', excerpt: 'How I started learning C++ and transitioned into full-stack development.', content: 'Full content goes here...', imageUrl: '' },
                    { title: 'Why I love React Native for Mobile Dev', date: 'Nov 02, 2023', excerpt: 'Exploring the benefits of cross-platform development.', content: 'Full content goes here...', imageUrl: '' }
                ];
                sampleBlogs.forEach(b => {
                    db.run(`INSERT INTO blogs (title, date, excerpt, content, imageUrl) VALUES (?, ?, ?, ?, ?)`, [b.title, b.date, b.excerpt, b.content, b.imageUrl]);
                });
            }
        });
    }
});

module.exports = db;
