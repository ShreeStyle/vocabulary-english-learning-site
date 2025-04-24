function verifyToken(req, res, next) {
    // Get token from header
    const token = req.headers["authorization"]
  
    if (!token) {
      return res.status(401).json({ message: "No token provided" })
    }
  
    if (token.includes("_")) {
      const username = token.split("_")[0]
      req.username = username // Store username in request object
      next()
    } else {
      res.status(401).json({ message: "Invalid token" })
    }
  }
  
  module.exports = { verifyToken }
  