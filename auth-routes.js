// auth-routes.js - Authentication endpoints
const express = require("express");
const router = express.Router();
const db = require("./database");

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error", error: err.message });
    }

    if (user) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    db.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password],
      function (err) {
        if (err) {
          return res.status(500).json({ success: false, message: "Error registering user", error: err.message });
        }

        res.json({
          success: true,
          message: "Registration successful!",
          user: {
            id: this.lastID,
            name,
            email
          }
        });
      }
    );
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  db.get("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error", error: err.message });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Generate simple token (for demonstration)
    const token = `${user.email}_${Date.now()}`;

    res.json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  });
});

module.exports = router;