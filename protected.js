const express = require('express');
const router = express.Router();
const db = require('./database');
const { verifyToken } = require('./middleware');

// Protected route to get user profile
router.get('/profile', verifyToken, (req, res) => {
  const username = req.username;
  
  db.get('SELECT id, username FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      message: 'Profile retrieved successfully',
      user: {
        id: user.id,
        username: user.username
      }
    });
  });
});

module.exports = router;