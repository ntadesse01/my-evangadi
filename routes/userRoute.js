const express = require("express");

//user controllers
const { checkUser, login, register } = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");

//register user
const router = express.Router();
router.post("/register", register);

//login user
router.post("/login", login);

//check user
router.get("/check", authMiddleware, checkUser);

module.exports = router;
