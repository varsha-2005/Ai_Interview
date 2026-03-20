const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes"));
app.use("/api/job", require("./routes/jobRoutes"));
app.use("/api/interview", require("./routes/interviewRoutes"));
app.use("/api/answers", require("./routes/answerRoutes"));
app.use("/api/result", require("./routes/resultRoutes"));

app.get("/", (req, res) => {
  res.send("API running...");
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);