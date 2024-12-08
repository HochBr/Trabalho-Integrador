const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "your-secret-key",
};

passport.use(
  new JwtStrategy(opts, (jwtPayload, done) => {
    console.log("JWT Payload recebido:", jwtPayload);
    if (jwtPayload) {
      return done(null, jwtPayload);
    }
    return done(null, false);
  })
);

const authenticateJWT = passport.authenticate("jwt", { session: false });

const restrictAccess = (roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.tipousuario)) {
      return next();
    }
    return res.status(403).json({ message: "Acesso negado." });
  };
};

module.exports = {
  authenticateJWT,
  restrictAccess,
};
