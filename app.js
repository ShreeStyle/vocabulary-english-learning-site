const express = require("express")
const app = express()

// Import routes
const authRoutes = require("./auth-routes")
const protectedRoutes = require("./protected")

// Middleware to parse request bodies
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Use routes
app.use("/auth", authRoutes)
app.use("/api", protectedRoutes)

// Serve static files from the public directory
app.use(express.static("public"))

// Basic route
app.get("/", (req, res) => {
  res.send("Welcome to the Simple Authentication App")
})

// Start server
const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
