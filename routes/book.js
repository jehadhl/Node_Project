const exprees = require("express");
const asyncHandler = require("express-async-handler");
const router = exprees.Router();
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");
const {
  Book,
  validationCreateBook,
  validationUpdateBook,
} = require("../models/Book");

/**
 * @description get all book
 * @route /api/books
 * @methode GET
 * @access PUBLIC
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const bookList = await Book.find().populate("author", [
      "_id ",
      "firstName",
      "lastName",
    ]);
    res.status(200).json(bookList);
  })
);

/**
 * @description get BOOK BY ID
 * @route /api/books/:id
 * @methode GET
 * @access PUBLIC
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = new Book.findById(req.params.id).populate("author");
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "book not found" });
    }
  })
);

/**
 * @description create book
 * @route /api/books/
 * @methode POST
 * @access PRIVATE ONLY ADMIN
 */
router.post(
  "/",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const { error } = validationCreateBook(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      price: req.body.price,
      cover: req.body.cover,
    });

    const result = await book.save();
    res.status(201).json(result); // 201 mean created succssfull
  })
);

/**
 * @description update a book
 * @route /api/books/:id
 * @methode PUT
 * @access PRIVATE ONLY ADMIN
 */

router.put(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const { error } = validationUpdateBook(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const book = await new Book.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          author: req.body.author,
          description: req.body.description,
          price: req.body.price,
          cover: req.body.cover,
        },
      },
      { new: true }
    );
    if (book) {
      res.status(200).json({ message: "book has been updated" });
    } else {
      res.status(404).json({ message: "book not found" });
    }
  })
);

/**
 * @description delete a book
 * @route /api/books/:id
 * @methode DELETE
 * @access PRIVATE ONLY ADMIN
 */
router.delete(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const book = new Book.findByIdAndDelete(req.params.id);
    if (book) {
      res.status(200).json({ message: "book has been deleted" });
    } else {
      res.status(404).json({ message: "book not found" });
    }
  })
);

module.exports = router;
