const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./portfolio.db');

db.serialize(() => {
    const insert = db.prepare(`INSERT INTO projects (title, description, tags, imageUrl) VALUES (?, ?, ?, ?)`);
    insert.run(
        'Luna AI',
        'An advanced artificial intelligence assistant offering two models: Luna Flash for fast and snappy responses, and Luna Pro for smarter, more detailed interactions. Features a modern, sleek chat interface.',
        '["React Native", "AI", "Python", "UX/UI"]',
        ''
    );
    insert.run(
        'Risel Growth Digital Agency',
        'A comprehensive digital agency platform empowering brands with strategies that elevate their success. Features services, reviews, and a robust contact system for client onboarding.',
        '["React", "Node.js", "Web Development", "Marketing"]',
        ''
    );
    insert.finalize();
    console.log("Projects seeded successfully!");
});
db.close();
