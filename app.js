// app.js - Main application server
const express = require("express");
const app = express();
const path = require("path");
const authRoutes = require("./auth-routes");
const protectedRoutes = require("./protected");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/api", protectedRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html for all other routes (for SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} in your browser`);
});