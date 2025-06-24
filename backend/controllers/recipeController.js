const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Recipe = require("../models/Recipe");
const User = require("../models/Users");

// Get all recipes by all users
// Get all recipes by all users, with optional filters
const getAllRecipes = async (req, res) => {
  try {
    const { type, cuisine, tags } = req.query;

    // Build the filter object dynamically based on query params
    const filter = {};

    if (type && type !== 'none') {
      filter.type = type;
    }
    if (cuisine && cuisine !== 'none') {
      filter.cuisine = cuisine;
    }

    if (tags && tags !== 'none') {
      // Assume tags query param is a comma separated string, e.g. "vegan,gluten free"
      const tagsArray = tags.split(',').map(tag => tag.trim());

      // Filter recipes that have any of the tags in their tags array
      filter.tags = { $in: tagsArray };
    }

    const recipes = await Recipe.find(filter).sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};


// Get all Recipes by single user
const getRecipesByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    // Find recipes where user_id equals the logged-in user's ID
    const recipes = await Recipe.find({ user_id: userId }).sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get user's recipes" });
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

    // add to user's createdRecipes array
    const user = await User.findById(user_id);
    user.createdRecipes.push(newRecipe._id);
    await user.save();

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

// save recipe to library
const saveRecipe = async (req, res) => {
  const recipeId = req.params.id;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

  if (!user.savedRecipes.some(id => id.toString() === recipeId)) {
    user.savedRecipes.push(recipeId);
    await user.save();
  }

    res.status(200).json({ message: "Recipe saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save recipe" });
  }
};

// unsave recipe from library
const unsaveRecipe = async (req, res) => {
  const recipeId = req.params.id;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    user.savedRecipes = user.savedRecipes.filter(id => id.toString() !== recipeId);
    await user.save();

    res.status(200).json({ message: "Recipe unsaved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to unsave recipe" });
  }
};

// Get all saved recipes by current user
const getSavedRecipes = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const savedRecipes = await Recipe.find({ _id: { $in: user.savedRecipes } }).sort({ createdAt: -1 });
    res.status(200).json(savedRecipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get saved recipes" });
  }
};


module.exports = {
  getAllRecipes,
  getRecipesByUser,
  addRecipe,
  getRecipeById,
  deleteRecipe,
  updateRecipe,
  saveRecipe,
  unsaveRecipe,
  getSavedRecipes,
};
