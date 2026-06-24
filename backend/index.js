require("dotenv").config();
const express = require("express");
const errorHandler = require("./src/middleware/errorHandler");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db");
const cors = require("cors");
const app = express();
const authRoutes = require("./src/routes/authRoutes");
const Job = require("./src/routes/jobRoutes");
const Proposal = require("./src/routes/propsaslRoutes");

app.use(cookieParser());
app.use(express.json());
// Connect to MongoDB
connectDB();
app.use(cors({ origin: '*', credentials: true }));
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}
app.get("/", (req, res) => {
  res.send("Welcome to the FreelanceHub API");
});
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/job", Job);
app.use("/api/proposals", Proposal);
//error handler
app.use(errorHandler);
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});