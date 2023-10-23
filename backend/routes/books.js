const express = require("express");
const Book = require("../models/Book");

const router = express.Router();

router.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find(); // Récupère tous les livres de la base de données
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id); // Trouve le livre par son _id
    if (!book) {
      return res.status(404).json({ message: "Book not found" }); // Si le livre n'est pas trouvé
    }
    res.status(200).json(book);
  } catch (error) {
    if (error.kind === "ObjectId") {
      // Vérifie si l'erreur est due à un _id non valide
      return res.status(400).json({ message: "Invalid book ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/api/books/bestrating", async (req, res) => {
  try {
    const books = await Book.find()
      .sort({ averageRating: -1 }) // Trie les livres par note moyenne décroissante
      .limit(3); // Limite la requête aux 3 premiers résultats
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
