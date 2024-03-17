const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Recipe = require("../models/Recipe");

// Get all recipes by all users
const getAllRecipes = async (req, res) => {
  try {
    const Recipes = await Recipe.find().sort({ createdAt: -1 });
    res.status(200).json(Recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get all Recipes by single user
const getRecipes = async (req, res) => {
  const user_id = req.user._id;

  try {
    const Recipes = await Recipe.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(Recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get Recipe by ID
const getRecipeById = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID / no such recipe" });
  }

  try {
    const user_id = req.user._id;

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// ADD Recipe
const addRecipe = async (req, res) => {
  const {
    title,
    ingredients,
    steps,
    time,
    difficulty,
    type,
    cuisine,
    tags,
    rating,
    user_id,
  } = req.body;

  try {
    const user_id = req.user._id;

    let imagePath = ""; // variable to store the image path

    if (req.file) {
      // Check if file is uploaded
      imagePath = req.file.path; // Save the image path
    }

    const newRecipe = new Recipe({
      title,
      ingredients,
      steps,
      time,
      difficulty,
      image: imagePath,
      type,
      cuisine,
      tags,
      rating,
      user_id,
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Update Recipe by ID
const updateRecipe = async (req, res) => {
  const id = req.params.id;
  try {
    const user_id = req.user._id;

    const recipe = await Recipe.findOne({ _id: id, user_id: user_id });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (req.file) {
      // Delete the old image file
      if (recipe.image) {
        fs.unlink(path.join(__dirname, "..", recipe.image), (err) => {
          if (err) {
            console.error(err);
          }
        });
      }

      // Update the image path
      recipe.image = req.file.path;
    }

    // Update other fields in the recipe
    for (let prop in req.body) {
      recipe[prop] = req.body[prop];
    }

    await recipe.save();

    res.status(200).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Delete Recipe by ID
const deleteRecipe = async (req, res) => {
  const id = req.params.id;
  try {
    const user_id = req.user._id;
    const recipe = await Recipe.findByIdAndDelete({
      _id: id,
      user_id: user_id,
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Delete the image file
    if (recipe.image) {
      fs.unlink(path.join(__dirname, "..", recipe.image), (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  getAllRecipes,
  getRecipes,
  addRecipe,
  getRecipeById,
  deleteRecipe,
  updateRecipe,
};
