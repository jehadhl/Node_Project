const exprees = require("express");
const asyncHandler = require("express-async-handler");
const router = exprees.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  User,
  validationRegisterUser,
  validationLoginUser,
} = require("../models/User");

/**
 * @description Register New User
 * @route /api/auth/register
 * @methode POST
 * @access PUBLIC
 */

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { error } = validationRegisterUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).json({ message: "this user already login" });
    }

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    user = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });

    const result = await user.save();
    const token = user.generateToken();

    const { password, ...other } = result._doc;
    res.status(201).json({ ...other, token });
  })
);

/**
 * @description login User
 * @route /api/auth/login
 * @methode POST
 * @access PUBLIC
 */

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { error } = validationLoginUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ message: "invalid name" });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordMatch) {
      console.log(passwordMatch, "headsd");
      return res.status(400).json({ message: "invalid password" });
    }

    const token = user.generateToken();
    const { password, ...other } = user._doc;
    res.status(200).json({ ...other, token });
  })
);

module.exports = router;
