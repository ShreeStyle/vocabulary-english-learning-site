const express = require("express")
const router = express.Router()
const db = require("./database")

router.post("/register", (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" })
  }

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.message })
    }

    if (user) {
      return res.status(409).json({ message: "Username already exists" })
    }

    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], function (err) {
      if (err) {
        return res.status(500).json({ message: "Error registering user", error: err.message })
      }

      return res.status(201).json({
        message: "User successfully registered",
        userID: this.lastID,
      })
    })
  })
})

router.post("/login", (req, res) => {
  const { username, password } = req.body

  // Simple validation
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" })
  }

  // Check credentials
  db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, user) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.message })
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Generate a simple token (just for demonstration)
    const token = `${username}_${Date.now()}`

    res.json({
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        username: user.username,
      },
    })
  })
})

module.exports = router
