const express = require("express");
const router = express.Router();

const { post_answer, all_answer } = require("../controller/answerController");

router.post("/postanswer/:questionid", post_answer);
router.get("/allanswer/:questionid", all_answer);

module.exports = router;
