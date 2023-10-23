const express = require("express");
const app = express();
const cors = require("cors");

const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");

app.use(bookRoutes);
app.use(authRoutes);

app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to my app!" });
});

module.exports = app;
