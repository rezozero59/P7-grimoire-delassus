const mongoose = require("mongoose");

// Schéma pour les notes données à un livre
const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Utilisation de ObjectId pour les identifiants MongoDB
    required: true,
    ref: "User", // Référence au modèle User
  },
  grade: {
    type: Number,
    required: true,
    min: 0, // une note minimale
    max: 5, // Et une note maximale, entre 0 et 5
  },
});

// Schéma principal pour le livre
const bookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  ratings: [ratingSchema], // Utilisation du schéma des notes défini précédemment
  averageRating: {
    type: Number,
    default: 0, // La valeur par défaut
  },
  ratings: [
    {
      userId: String,
      grade: Number,
    },
  ],
});

module.exports = mongoose.model("Book", bookSchema);
