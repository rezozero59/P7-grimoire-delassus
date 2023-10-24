const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Récupère le token du header de la requête
    const token = req.headers.authorization.split(" ")[1];

    // Vérifie le token
    const decodedToken = jwt.verify(token, "YOUR_SECRET_KEY"); // Utilise la même clé secrète que lors de la signature du token
    req.user = { userId: decodedToken.userId }; // Stocker l'ID de l'utilisateur dans la requête pour un accès ultérieur

    next(); // Passe au prochain middleware ou à la fonction de route
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
