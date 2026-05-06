const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: User not authenticated." });
    }

    // Super Admin override or check specific permission
    if (
      req.user.role && 
      (req.user.role.name === 'Super Admin' || (req.user.role.permissions && req.user.role.permissions.includes(permission)))
    ) {
      return next();
    }

    return res.status(403).json({
      error: `Forbidden: You do not have the required permission (${permission}) to perform this action.`,
    });
  };
};

module.exports = { requirePermission };
