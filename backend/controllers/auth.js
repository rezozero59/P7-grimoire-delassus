const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email non valide" });
    }

    // Vérification de la complexité du mot de passe
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Le mot de passe doit contenir au moins 8 caractères, dont des chiffres, des lettres majuscules et minuscules.",
      });
    }

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
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

    res.status(201).json({ message: "Utilisateur enregistré avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouve l'utilisateur par e-mail
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Vérifie le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Crée un token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "24h",
    });

    res.status(200).json({ userId: user._id, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
