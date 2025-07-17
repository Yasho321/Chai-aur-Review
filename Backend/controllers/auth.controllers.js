export const getMe =  (req, res) => {
    if (req.user) {
        res.json({
          user: {
            id: req.user._id,
            email: req.user.email,
            name: req.user.name,
            role: req.user.role,
          },
        });
      } else {
        res.status(401).json({ message: "Not authenticated" });
      }
}

export const logout =  (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ message: "Logged out successfully" });
  });
}