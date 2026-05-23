require("dotenv").config();
const express = require("express");
const errorHandler = require("./src/middleware/errorHandler");
const connectDB = require("./src/config/db");
const cors = require("cors");
const app = express();

// Connect to MongoDB
connectDB();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}
app.get("/", (req, res) => {
  res.send("Welcome to the FreelanceHub API");
});
//error handler
app.use(errorHandler);
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});