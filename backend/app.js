require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const multer = require("multer");

const authRoutes = require("./routes/auth");
// const bookRoutes = require("./routes/books");

// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, "uploads/");
//   },
//   filename: (req, file, callback) => {
//     callback(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@grimoire.cafkgzn.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// app.use(bookRoutes);
// app.use(authRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
// app.use("/api/books", bookRoutes);

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

module.exports = app;
