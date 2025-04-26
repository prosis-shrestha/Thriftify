const adminAuth = (req, res, next) => {
  try {
    const user = req.session.user;

    if (!user) {
      throw new Error("You must be logged in");
    }

    if (!user.isAdmin) {
      throw new Error("Admin access required");
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = adminAuth;
