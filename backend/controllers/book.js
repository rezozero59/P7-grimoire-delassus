const Book = require("../models/Book");
const authMiddleware = require("../middleware/authToken");
const fs = require("fs");
const path = require("path");

(exports.createBook = authMiddleware),
  upload.single("image"),
  async (req, res) => {
    try {
      const bookData = JSON.parse(req.body.book); // Analyse du livre transformé en chaîne de caractères
      const imageUrl = "/uploads/" + req.file.filename; // Chemin d'accès à l'image enregistrée

      const book = new Book({
        ...bookData,
        imageUrl: imageUrl,
        userId: req.user._id, // Supposons que votre middleware d'authentification ajoute l'ID de l'utilisateur à req.user
        averageRating: 0, // Initialise la note moyenne à 0
        ratings: [], // Initialise les avis avec un tableau vide
      });

      await book.save();

      res.status(201).json({ message: "Book successfully added" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

(exports.createRating = authMiddleware),
  async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      const { userId, rating } = req.body;

      // Vérifiez si la note est valide
      if (rating < 0 || rating > 5) {
        return res
          .status(400)
          .json({ message: "Rating must be between 0 and 5" });
      }

      // Vérifiez si l'utilisateur a déjà noté ce livre
      const userRating = book.ratings.find((r) => r.userId === userId);
      if (userRating) {
        return res
          .status(400)
          .json({ message: "User has already rated this book" });
      }

      // Ajoutez la note de l'utilisateur
      book.ratings.push({ userId, grade: rating });

      // Mettez à jour la note moyenne
      const totalRating = book.ratings.reduce((acc, r) => acc + r.grade, 0);
      book.averageRating = totalRating / book.ratings.length;

      // Sauvegardez les modifications dans la base de données
      await book.save();

      // Renvoyez le livre mis à jour en réponse
      res.status(200).json(book);
    } catch (error) {
      if (error.kind === "ObjectId") {
        // Vérifie si l'erreur est due à un _id non valide
        return res.status(400).json({ message: "Invalid book ID" });
      }
      res.status(500).json({ message: "Server error" });
    }
  };

exports.readBookList = async (req, res) => {
  try {
    const books = await Book.find(); // Récupère tous les livres de la base de données
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.readBook = async (req, res) => {
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
};

exports.readBookRating = async (req, res) => {
  try {
    const books = await Book.find()
      .sort({ averageRating: -1 }) // Trie les livres par note moyenne décroissante
      .limit(3); // Limite la requête aux 3 premiers résultats
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

(exports.updateBook = authMiddleware),
  upload.single("image"),
  async (req, res) => {
    try {
      let updatedBookData;
      if (req.file) {
        // Si une image est fournie
        const imageUrl = "/uploads/" + req.file.filename;
        updatedBookData = JSON.parse(req.body.book);
        updatedBookData.imageUrl = imageUrl; // Mettez à jour l'URL de l'image
      } else {
        // Si aucune image n'est fournie
        updatedBookData = req.body;
      }

      // Mettre à jour le livre dans la base de données
      const updatedBook = await Book.findByIdAndUpdate(
        req.params.id,
        { $set: updatedBookData },
        { new: true }
      );

      if (!updatedBook) {
        return res.status(404).json({ message: "Book not found" });
      }

      res.status(200).json({ message: "Book successfully updated" });
    } catch (error) {
      if (error.kind === "ObjectId") {
        // Vérifie si l'erreur est due à un _id non valide
        return res.status(400).json({ message: "Invalid book ID" });
      }
      res.status(500).json({ message: "Server error" });
    }
  };

(exports.deleteBook = authMiddleware),
  async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      // Supprimez l'image associée du serveur
      if (book.imageUrl) {
        const imagePath = path.join(__dirname, "..", book.imageUrl);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Error deleting the image:", err);
          }
        });
      }

      // Supprime le livre de la base de données
      await Book.findByIdAndDelete(req.params.id);

      res.status(200).json({ message: "Book successfully deleted" });
    } catch (error) {
      if (error.kind === "ObjectId") {
        // Vérifie si l'erreur est due à un _id non valide
        return res.status(400).json({ message: "Invalid book ID" });
      }
      res.status(500).json({ message: "Server error" });
    }
  };
