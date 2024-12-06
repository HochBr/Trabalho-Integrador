const passport = require("passport");

const restrictAccess = (roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.tipousuario)) {
      return next();
    }
    return res.status(403).json({ message: "Acesso negado." });
  };
};

module.exports = {
  authenticateJWT: passport.authenticate("jwt", { session: false }),
  restrictAccess,
};
