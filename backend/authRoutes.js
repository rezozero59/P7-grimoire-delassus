const express = require("express");
const bcrypt = require("bcrypt");
const User = require("./models/User.js");

const router = express.Router();

router.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
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

module.exports = router;
