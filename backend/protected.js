const express = require("express");
const router = express.Router();
const db = require("./database");
const { verifyToken } = require("./middleware");

router.get("/profile", verifyToken, (req, res) => {
  const email = req.email;
  
  db.get("SELECT id, name, email FROM users WHERE email = ?", [email], (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error", error: err.message });
    }
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.json({ 
      success: true,
      message: "Profile retrieved successfully",
      user
    });
  });
});

module.exports = router;