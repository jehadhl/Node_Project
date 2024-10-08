const exprees = require("express");
const asyncHandler = require("express-async-handler");
const router = exprees.Router();
const bcrypt = require("bcryptjs");
const { validatioUpdateUser, User } = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthoraziation,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");

/**
 * @description update User
 * @route /api/users/:id
 * @methode PUT
 * @access PRIVTE
 */
//Protected Route
router.put(
  "/:id",
  verifyTokenAndAuthoraziation,
  asyncHandler(async (req, res) => {
    const { error } = validatioUpdateUser(req.body);
    if (error) {
      return req.status(400).json({ message: error.details[0].message });
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updateUser = await User.findByIdAndDelete(
      req.params.id,
      {
        $set: {
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
        },
      },
      { new: true }
    ).select("-password");
    res.status(200).json(updateUser);
  })
);

/**
 * @description get User
 * @route /api/users
 * @methode Get
 * @access PRIVTE only admin
 */
//Protected Route
router.get(
  "/",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  })
);

/**
 * @description get User by id
 * @route /api/users
 * @methode GET
 * @access PRIVTE only admin and user
 */
//Protected Route
router.get(
  "/:id",
  verifyTokenAndAuthoraziation,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "user not found" });
    }
  })
);

/**
 * @description delete User
 * @route /api/users
 * @methode Delete
 * @access PRIVTE only admin and user
 */
//Protected Route
router.delete(
  "/:id",
  verifyTokenAndAuthoraziation,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: " user has been deleted successfly" });
    } else {
      res.status(404).json({ message: "user not found" });
    }
  })
);

module.exports = router;
