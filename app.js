require("dotenv").config();
const express = require("express");
const dbConnection = require("./db/dbConfig");
const userRouter = require("./routes/userRoute");
const questionRouter = require("./routes/questionRoute");
//authentication middleware
const authMiddleware = require("./middleware/authMiddleware");
const app = express();
//port number
const port = 5500;

app.use(express.json());
//user routes middleware
app.use("/api/users", userRouter);

//question routes middleware
app.use("/api/questions", authMiddleware, questionRouter);
//answer routes middleware
async function start() {
  try {
    const result = await dbConnection.execute("select 'test' ");
    await app.listen(port);
    console.log("darabase connection established");
    console.log(`listening${port}`);
  } catch (error) {
    console.log(error.message);
  }
}
start();
