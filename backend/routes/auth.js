const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const router = express.Router();

router.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création d'un nouvel utilisateur
    const user = new User({
      email,
      password: hashedPassword,
    });

    // Sauvegarde de l'utilisateur dans la base de données
    await user.save();

    res.status(201).json({ message: "User successfully registered" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur par e-mail
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect" });
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Créer un token JWT
    const token = jwt.sign(
      { userId: user._id },
      "YOUR_SECRET_KEY", // Remplacer par une clé secrète robuste
      { expiresIn: "24h" }
    );

    res.status(200).json({ userId: user._id, token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;