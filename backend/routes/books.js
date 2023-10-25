const express = require("express");
const bookController = require("../controllers/book");
const auth = require("../middleware/authToken");
const multer = require("../middleware/multer-config");
const sharpMiddleware = require("../middleware/sharp-config");

const router = express.Router();

router.post("/", auth, multer, sharpMiddleware, bookController.createBook);

router.put("/:id", auth, multer, sharpMiddleware, bookController.updateBook);

router.post("/:id/rating", auth, bookController.createRating);

router.get("/", bookController.readBookList);

router.get("/bestrating", bookController.readBookRating);

router.get("/:id", bookController.readBook);

router.delete("/:id", auth, bookController.deleteBook);

module.exports = router;
