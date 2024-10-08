const jwt = require("jsonwebtoken");

//verify token
function verifyToken(req, res, next) {
  const token = req.headers.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(404).json({ message: "invalid token" });
    }
  } else {
    res.status(404).json({ message: "no token provided" });
  }
}

//verify token &Authorize the user
function verifyTokenAndAuthoraziation(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id !== req.params.id || req.user.isAdmin) {
      next();
    } else {
      return req.status(403).json({
        message: "you are not allowed , you only can update your profile",
      }); //status 403 not allowed
    }
  });
}

//verify token &  admin
function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return req.status(403).json({
        message: "you are not allowed , only admin",
      }); //status 403 not allowed
    }
  });
}

module.exports = {
  verifyToken,
  verifyTokenAndAuthoraziation,
  verifyTokenAndAdmin,
};
