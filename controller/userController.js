//db connection
const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;
  if (!username || !firstname || !lastname || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please provide all required information!" });
  }

  try {
    const [user] = await dbConnection.query(
      "SELECT username, userid from users WHERE username =? or email = ?",
      [username, email]
    );
    if (user.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "user already registered" });
    }
    if (password.length < 8) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Password must be at least 8 characters long!",
      });
    }
    //encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await dbConnection.query(
      "INSERT INTO users (username,firstname, lastname, email, password) VALUES (?,?,?,?,?)",
      [username, firstname, lastname, email, hashedPassword]
    );

    return res.status(StatusCodes.CREATED).json({
      msg: `User ${username} has been registered!`,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong please try again later" });
  }
}
//Login is here

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please provide all required information!" });
  }

  try {
    const [user] = await dbConnection.query(
      "select username, userid, password from users where email=?",
      [email]
    );
    if (user.length == 0) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid Email" });
    }
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "invalid credential" });
    }
    const userid = user[0].userid;
    const username = user[0].username;
    const token = jwt.sign({ userid, username }, "secret", { expiresIn: "1d" });
    return res
      .status(StatusCodes.OK)
      .json({ msg: `user ${username} success fully signed up`, token });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong please try again later" });
  }
}

async function checkUser(req, res) {
  const username = req.user.username;
  const userid = req.user.userid;
  return res
    .status(StatusCodes.OK)
    .json({ msg: "valid user", username, userid });
}
module.exports = { register, login, checkUser };
