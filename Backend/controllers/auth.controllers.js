export const getMe =  (req, res) => {
    if (req.user) {
        return res.status(200).json({
            success : true,
          user: {
            id: req.user._id,
            email: req.user.email,
            name: req.user.name,
            role: req.user.role,
          },
          message : "User data fetched successfully",
        });
      } else {
        return res.status(401).json({
            success : false,
             message: "Not authenticated" });
      }
}

export const logout =  (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
         message: "Logout failed" });
    }
    return res.json({
        success: true,
         message: "Logged out successfully" });
  });
}