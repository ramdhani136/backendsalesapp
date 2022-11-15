const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({
        status: false,
        message: "Forbiden, you have to login to access the data!",
      });
    req.userId = decoded.userId;
    req.username = decoded.username;
    next();
  });
};

module.exports = { verifyToken };
