const express = require("express");
const router = express.Router();

const bookController = require("../controllers/book");

router.post("/", bookController.createBook);

router.post("/:id/rating", bookController.createRating);

router.get("/", bookController.readBookList);

router.get("/:id", bookController.readBook);

router.get("/bestrating");
bookController.readBookRating;

router.put("/:id", bookController.updateBook);

router.delete("/:id", bookController.deleteBook);

module.exports = router;
