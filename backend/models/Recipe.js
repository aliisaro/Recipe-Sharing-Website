const mongoose = require("mongoose");
const fs = require("fs");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    ingredients: {
      type: String,
      required: true,
    },
    steps: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    image: {
    type: String, // Base64 string
    required: true
    },
    type: {
      type: String,
      required: true,
    },
    cuisine: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
        required: true,
      },
    ],
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
      ratings: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          value: { type: Number, min: 1, max: 5 },
        }
      ]
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
