const mongoose = require("mongoose");
const Joi = require("joi");

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 250,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Author",
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  cover: {
    type: String,
    required: true,
    enum: ["soft cover", "hard cover"],
  },
});

const Book = mongoose.model("Book", BookSchema);

function validationUpdateBook(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(2).max(200),
    author: Joi.string().trim().min(2).max(200),
    description: Joi.string().trim().min(2).max(500),
    price: Joi.number().min(0),
    cover: Joi.string().trim(),
  });

  return schema.validate(obj);
}

// validation
function validationCreateBook(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(2).max(200).required(),
    author: Joi.string().trim().min(2).max(200).required(),
    description: Joi.string().trim().min(2).max(500).required(),
    price: Joi.number().min(0).required(),
    cover: Joi.string().trim().valid("soft cover", "hard cover").required(),
  });

  return schema.validate(obj);
}

module.exports = {
  Book,
  validationUpdateBook,
  validationCreateBook,
};
