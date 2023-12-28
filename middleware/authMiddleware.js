const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalid" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const { userid, username } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { username, userid };
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Invalid Authentication" });
  }
}

module.exports = authMiddleware;
