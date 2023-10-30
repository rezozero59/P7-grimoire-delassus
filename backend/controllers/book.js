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

    res.status(201).json({ message: "Livre ajouté avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createRating = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });

    if (!book) {
      return res.status(404).json({ error: error.message });
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
        .json({ message: "Livre déjà noté par l'utilisateur" });
    }

    // Ajoute la note de l'utilisateur
    book.ratings.push({ userId, grade: rating });

    // Met à jour la note moyenne
    const totalRating = book.ratings.reduce((acc, r) => acc + r.grade, 0);
    book.averageRating = parseFloat(
      (totalRating / book.ratings.length).toFixed(1)
    );

    // Sauvegarde les modifications dans la base de données
    await book.save();

    // Renvoie le livre mis à jour en réponse
    res.status(200).json(book);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.readBookList = async (req, res) => {
  try {
    const books = await Book.find(); // Récupère tous les livres de la base de données
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
};

exports.readBookRating = async (req, res) => {
  try {
    const books = await Book.find()
      .sort({ averageRating: -1 }) // Trie les livres par note moyenne décroissante
      .limit(3); // Limite la requête aux 3 premiers résultats

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    let book = await Book.findOne({ _id: req.params.id });

    if (!book) {
      return res.status(404).json({ error: error.message });
    }

    if (book.userId != req.user.userId) {
      return res.status(403).json({ error: error.message });
    }

    if (req.file) {
      // Supprimer l'ancienne image si une nouvelle image est téléchargée
      const oldFilename = book.imageUrl.split("/images/")[1];
      fs.unlink(`images/${oldFilename}`, (unlinkError) => {
        if (unlinkError) {
          console.error(unlinkError);
        }
      });

      // Mise à jour de l'URL de l'image avec la nouvelle image
      book.imageUrl = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`;
    }

    // Mise à jour des autres données du livre
    const bookObject = req.file ? JSON.parse(req.body.book) : req.body;
    delete bookObject._userId; // Assurez-vous de supprimer les champs non nécessaires

    for (let key in bookObject) {
      if (bookObject.hasOwnProperty(key)) {
        book[key] = bookObject[key];
      }
    }

    await book.save();
    res.status(200).json({ message: "Livre modifié avec succès" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

exports.deleteBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.user.userId) {
        return res.status(403).json({ error: error.message });
      }

      const filename = book.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, (unlinkError) => {
        if (unlinkError) {
          return res.status(500).json({ error: unlinkError.message });
        }
        Book.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Livre supprimé !" }))
          .catch((deleteError) =>
            res.status(500).json({ error: deleteError.message })
          );
      });
    })
    .catch((findError) => {
      res.status(500).json({ error: findError.message });
    });
};
