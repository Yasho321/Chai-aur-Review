export const requireAuth = (req, res, next) => {
  console.log("Auth check - isAuthenticated:", req.isAuthenticated())
  console.log("Session ID:", req.sessionID)
  console.log("User:", req.user ? req.user.email : "No user")
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Authentication required" });
};

export const requireAdmin = (req, res, next) => {
   console.log("Admin check - User role:", req.user?.role)
  if (req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Admin access required" });
};
