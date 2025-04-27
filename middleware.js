// middleware.js - Authentication middleware
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  if (token.includes("_")) {
    const email = token.split("_")[0];
    req.email = email;
    next();
  } else {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
}

module.exports = { verifyToken };