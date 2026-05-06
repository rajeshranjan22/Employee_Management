const authorize = (roles = []) => {
  // roles can be a single role string (e.g. 'admin') or an array of roles
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not authenticated." });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden: Access denied for role '${req.user.role}'. Required roles: [${roles.join(", ")}]`,
      });
    }

    next();
  };
};

module.exports = { authorize };
