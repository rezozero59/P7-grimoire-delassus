const sharp = require("sharp");
const fs = require("fs");

const sharpMiddleware = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const filePath = req.file.path;

  sharp(filePath)
    .resize(600, 800, {
      fit: "cover",
    }) // Exemple de redimensionnement
    .toBuffer()
    .then((data) => {
      // Réécriture de l'image originale par l'image traitée
      fs.writeFile(filePath, data, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
        next();
      });
    })
    .catch((err) => res.status(500).send(err));
};

module.exports = sharpMiddleware;
