const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');

// GET all bookmarks
router.get('/', async (req, res) => {
    try {
        const bookmarks = await Bookmark.find().sort({ createdAt: -1 });
        res.json({ 
            success: true, 
            data: bookmarks 
        });
    } catch (error) {
        console.error('GET Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch bookmarks' 
        });
    }
});

// POST create bookmark
router.post('/', async (req, res) => {
    try {
        console.log('Received data:', req.body); // Debug log
        
        const { title, url } = req.body;
        
        // Validate input
        if (!title || !url) {
            return res.status(400).json({ 
                success: false, 
                error: 'Title and URL are required' 
            });
        }
        
        // Create bookmark
        const bookmark = await Bookmark.create({
            title: title.trim(),
            url: url.trim()
        });
        
        console.log('Bookmark created:', bookmark); // Debug log
        
        res.status(201).json({ 
            success: true, 
            data: bookmark 
        });
    } catch (error) {
        console.error('POST Error:', error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ 
                success: false, 
                error: messages 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Failed to create bookmark' 
        });
    }
});

// PUT update bookmark
router.put('/:id', async (req, res) => {
    try {
        const bookmark = await Bookmark.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!bookmark) {
            return res.status(404).json({ 
                success: false, 
                error: 'Bookmark not found' 
            });
        }
        
        res.json({ 
            success: true, 
            data: bookmark 
        });
    } catch (error) {
        console.error('PUT Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to update bookmark' 
        });
    }
});

// DELETE bookmark
router.delete('/:id', async (req, res) => {
    try {
        const bookmark = await Bookmark.findByIdAndDelete(req.params.id);
        
        if (!bookmark) {
            return res.status(404).json({ 
                success: false, 
                error: 'Bookmark not found' 
            });
        }
        
        res.json({ 
            success: true, 
            data: {} 
        });
    } catch (error) {
        console.error('DELETE Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to delete bookmark' 
        });
    }
});

module.exports = router;