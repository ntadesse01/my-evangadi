const express = require("express");
const {
  postQuestions,
  allQuestions,
  singleQuestions,
} = require("../controller/questionController");
const router = express.Router();
//post questions routes
router.post("/post_question", postQuestions);
//all questions routes
router.get("/all-questions", allQuestions);
//single questions routes
router.get("/question/:questionid", singleQuestions);
module.exports = router;
