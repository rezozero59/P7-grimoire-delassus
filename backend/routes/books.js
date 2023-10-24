const express = require("express");
const bookController = require("../controllers/book");
const auth = require("../middleware/authToken");
const multer = require("../middleware/multer-config");
const router = express.Router();

router.post("/", auth, multer, bookController.createBook);

router.post("/:id/rating", auth, bookController.createRating);

router.get("/", bookController.readBookList);

router.get("/bestrating", bookController.readBookRating);

router.get("/:id", bookController.readBook);

router.put("/:id", auth, multer, bookController.updateBook);

router.delete("/:id", auth, bookController.deleteBook);

module.exports = router;
