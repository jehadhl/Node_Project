const exprees = require("express");
const asyncHandler = require("express-async-handler");
const router = exprees.Router();
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");
const {
  Author,
  validationCreateAuthor,
  validationUpdateAuthor,
} = require("../models/Author");

/**
 * @description get all authors
 * @route /api/authors
 * @methode GET
 * @access PUBLIC
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const authorList = await Author.find();
    res.status(200).json(authorList);
  })
);

/**
 * @description get authors BY ID
 * @route /api/authors/:id
 * @methode GET
 * @access PUBLIC
 */
router.get(
  "/:id",
  asyncHandler((req, res) => {
    const author = new Author.findById(req.params.id);
    if (author) {
      res.status(200).json(author);
    } else {
      res.status(404).json({ message: "author not found" });
    }
  })
);

/**
 * @description create author
 * @route /api/author/
 * @methode POST
 * @access Private only admin
 */

router.post(
  "/",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const { error } = validationCreateAuthor(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const author = new Author({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      nationality: req.body.nationality,
      image: req.body.image,
    });

    const result = await author.save();
    res.status(201).json(result); // 201 mean created succssfull
  })
);

/**
 * @description update a book
 * @route /api/books/:id
 * @methode PUT
 * @access PRIVATE only admin
 */

router.put(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const { error } = validationUpdateAuthor(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const author = await new Author.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          nationality: req.body.nationality,
          image: req.body.image,
        },
      },
      { new: true }
    );
    if (author) {
      res.status(200).json({ message: "author has been updated" });
    } else {
      res.status(404).json({ message: "author not found" });
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
    const author = new Author.findByIdAndDelete(req.params.id);
    if (author) {
      res.status(200).json({ message: "author has been deleted" });
    } else {
      res.status(404).json({ message: "author not found" });
    }
  })
);

module.exports = router;
