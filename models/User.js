const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    email: {
      required: true,
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 50,
      unique: true,
    },
    username: {
      required: true,
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 50,
      unique: true,
    },
    password: {
      required: true,
      type: String,
      trim: true,
      minlength: 6,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//generate Token
UserSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET_KEY
  );
};

const User = mongoose.model("User", UserSchema);

// validation Register
function validationRegisterUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(2).max(50).required().email(),
    username: Joi.string().trim().min(2).max(50).required(),
    password: Joi.string().trim().min(6).required(),
  });

  return schema.validate(obj);
}

// validation Login
function validationLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(2).max(50).required().email(),
    password: Joi.string().trim().min(6).required(),
  });

  return schema.validate(obj);
}

// validation Update User
function validatioUpdateUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(2).max(50).email(),
    username: Joi.string().trim().min(2).max(50),
    password: Joi.string().trim().min(6),
  });

  return schema.validate(obj);
}

module.exports = {
  User,
  validationRegisterUser,
  validationLoginUser,
  validatioUpdateUser,
};
