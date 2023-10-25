const Book = require("../models/Book");
const fs = require("fs");
const path = require("path");

exports.createBook = async (req, res) => {
  try {
    const bookData = JSON.parse(req.body.book); // Analyse du livre transformé en chaîne de caractères
    delete bookData._id; // Supprime l'_id du livre
    delete bookData._userId;

    const book = new Book({
      ...bookData,

      userId: req.user.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    });

    await book.save();

    res.status(201).json({ message: "Book successfully added" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createRating = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const { userId, rating } = req.body;

    // Vérifie si la note est valide
    if (rating < 0 || rating > 5) {
      return res
        .status(400)
        .json({ message: "La note doit être entre 0 and 5" });
    }

    // Vérifie si l'utilisateur a déjà noté ce livre
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
    const book = await Book.findOne({ _id: req.params.id }); // Trouve le livre par son _id
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

exports.updateBook = async (req, res) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete bookObject._userId;

  try {
    let book = await Book.findOne({ _id: req.params.id });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.userId != req.user.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Mise à jour des autres données du livre
    for (let key in bookObject) {
      if (bookObject.hasOwnProperty(key)) {
        book[key] = bookObject[key];
      }
    }

    await book.save();

    res.status(200).json({ message: "Book successfully updated" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ message: "Invalid book ID" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!book) {
      return res
        .status(404)
        .json({ message: "Book not found or user not authorized to delete" });
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

    res.status(200).json({ message: "Book successfully deleted" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid book ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
};
