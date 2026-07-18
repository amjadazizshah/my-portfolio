const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded images static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const JWT_SECRET = 'super-secret-portfolio-key';

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// --- AUTH ROUTE ---
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });
        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'No token provided' });
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });
        req.user = decoded;
        next();
    });
};

// --- IMAGE UPLOAD ---
app.post('/api/upload', verifyToken, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// --- PROJECTS ROUTES ---
app.get('/api/projects', (req, res) => {
    db.all(`SELECT * FROM projects`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows.map(r => ({...r, tags: JSON.parse(r.tags || '[]')})));
    });
});

app.post('/api/projects', verifyToken, (req, res) => {
    const { title, description, tags, imageUrl, link } = req.body;
    db.run(`INSERT INTO projects (title, description, tags, imageUrl, link) VALUES (?, ?, ?, ?, ?)`, 
        [title, description, JSON.stringify(tags || []), imageUrl, link], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
    });
});

app.get('/api/projects/:id', (req, res) => {
    db.get(`SELECT * FROM projects WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Project not found' });
        res.json({...row, tags: JSON.parse(row.tags || '[]')});
    });
});

app.put('/api/projects/:id', verifyToken, (req, res) => {
    const { title, description, tags, imageUrl, link } = req.body;
    db.run(`UPDATE projects SET title = ?, description = ?, tags = ?, imageUrl = ?, link = ? WHERE id = ?`, 
        [title, description, JSON.stringify(tags || []), imageUrl, link, req.params.id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ updated: this.changes });
    });
});

app.delete('/api/projects/:id', verifyToken, (req, res) => {
    db.run(`DELETE FROM projects WHERE id = ?`, [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

// --- BLOGS ROUTES ---
app.get('/api/blogs', (req, res) => {
    db.all(`SELECT * FROM blogs ORDER BY id DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/blogs', verifyToken, (req, res) => {
    const { title, date, excerpt, content, imageUrl } = req.body;
    db.run(`INSERT INTO blogs (title, date, excerpt, content, imageUrl) VALUES (?, ?, ?, ?, ?)`, 
        [title, date, excerpt, content, imageUrl], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
    });
});

app.delete('/api/blogs/:id', verifyToken, (req, res) => {
    db.run(`DELETE FROM blogs WHERE id = ?`, [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
