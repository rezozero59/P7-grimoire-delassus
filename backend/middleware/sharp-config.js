const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const sharpMiddleware = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const filePath = req.file.path;
  const outputFilePath = path.join(
    path.dirname(filePath),
    `${path.basename(filePath, path.extname(filePath))}.webp`
  );

  sharp(filePath)
    .resize({
      width: 600,
      withoutEnlargement: true,
    })
    .toFormat("webp", {
      quality: 80,
    })
    .toFile(outputFilePath, (err, info) => {
      if (err) {
        return res.status(500).send(err);
      }

      // Supprimer l'ancienne image si elle existe
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error(
            "Erreur lors de la suppression de l'ancienne image",
            unlinkErr
          );
        }
      });

      // Mise à jour du chemin du fichier dans l'objet `req.file`
      req.file.path = outputFilePath;
      req.file.filename = path.basename(outputFilePath);

      next();
    });
};

module.exports = sharpMiddleware;
