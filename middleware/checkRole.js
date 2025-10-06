// middleware/checkRole.js
module.exports = function checkRole(requiredRole) {
  return (req, res, next) => {
    const user = req.user;

    if (!user || user.role !== requiredRole) {
      return res.status(403).json({ message: "Доступ запрещен" });
    }

    next();
  };
};
