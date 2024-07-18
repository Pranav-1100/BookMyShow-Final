const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    if (!req.headers.authorization) {
      return res.status(401).send({ success: false, message: "Token Missing" });
    }
    const token = req.headers.authorization.split(" ")[1];
    const verifiedtoken = jwt.verify(token, process.env.secret_key_jwt);
    req.body.userId = verifiedtoken.userId;
    next();
  } catch (error) {
    res.status(401).send({ success: false, message: "Token Invalid" });
  }
};
