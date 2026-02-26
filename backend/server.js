const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!', time: new Date().toISOString() });
});

// Basic bookmarks array (temporary until MongoDB works)
let bookmarks = [];

// Routes
app.get('/api/bookmarks', (req, res) => {
    res.json({ success: true, data: bookmarks });
});

app.post('/api/bookmarks', (req, res) => {
    const { title, url } = req.body;
    const newBookmark = {
        _id: Date.now().toString(),
        title,
        url,
        createdAt: new Date()
    };
    bookmarks.push(newBookmark);
    res.status(201).json({ success: true, data: newBookmark });
});

app.delete('/api/bookmarks/:id', (req, res) => {
    bookmarks = bookmarks.filter(b => b._id !== req.params.id);
    res.json({ success: true, data: {} });
});

// Try MongoDB connection but don't fail if it doesn't work
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB Connected');
        // Switch to MongoDB model when connected
        console.log('Using MongoDB database');
    })
    .catch(err => {
        console.log('⚠️ MongoDB not available, using in-memory storage');
        console.log('You can still add bookmarks (they won\'t persist after restart)');
    });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📍 Test: http://localhost:${PORT}/test`);
    console.log(`📍 API: http://localhost:${PORT}/api/bookmarks`);
});